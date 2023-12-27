import { Post as IPost } from "./Main"
import { db, auth } from "../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";


interface Props {
    post: IPost;
}

interface Like {
    likeId: string;
    userId: string;
    emojiType: string;
}

enum emojiCode {
    eLike = "Like",
    eLove = "Love",
}

export const Post = (props: Props) => {
    const { post } = props;
    const [user] = useAuthState(auth);
    const [likeCount, setLikeCount] = useState<Like[] | null>(null);
    const [loveCount, setLoveCount] = useState<Like[] | null>(null);
    const likesRef = collection(db, "likes");
    const getLikes = async (eType: emojiCode) => {
        const likesDoc = query(likesRef, where("postId", "==", post.id), where("emojiType", "==", eType));
        const data = await getDocs(likesDoc);
        //console.log(data.docs.length);
        if(eType === emojiCode.eLike)
            setLikeCount(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id, emojiType: eType})));
        else if(eType === emojiCode.eLove)
            setLoveCount(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id, emojiType: eType})));
    }
    const onAddLike = async (eType: emojiCode) => {
        try {
            const newDoc = await addDoc(likesRef, {
            userId: user?.uid, 
            postId: post.id,
            emojiType: eType,
            });
            if(user){
              if(eType === emojiCode.eLike)
                setLikeCount((prev) => 
                prev ? [...prev, {userId: user?.uid, likeId: newDoc.id, emojiType: eType}] 
                : [{userId: user?.uid, likeId: newDoc.id, emojiType: eType}]);
              else if(eType === emojiCode.eLove)
                setLoveCount((prev) => 
                prev ? [...prev, {userId: user?.uid, likeId: newDoc.id, emojiType: eType}] 
                : [{userId: user?.uid, likeId: newDoc.id, emojiType: eType}]);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const onRemoveLike = async (eType: emojiCode) => {
        try {
            const likeToDeleteQuery = query(likesRef, 
                where("postId", "==", post.id),
                where("userId", "==", user?.uid),
                where("emojiType", "==", eType)
                );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);
            await deleteDoc(likeToDelete);
            if(user){
              if(eType === emojiCode.eLike)
                setLikeCount((prev) => 
                prev && prev.filter((like) => like.likeId !== likeId));
              else if(eType === emojiCode.eLove)
                setLoveCount((prev) => 
                prev && prev.filter((like) => like.likeId !== likeId));
            }
        } catch (err) {
            console.log(err);
        }
    } 
    const hasUserLiked = likeCount?.find((like) => like.userId === user?.uid && like.emojiType === emojiCode.eLike)
    const hasUserLoved = loveCount?.find((like) => like.userId === user?.uid && like.emojiType === emojiCode.eLove)
    useEffect(() => {
        getLikes(emojiCode.eLike); // eslint-disable-next-line        
        getLikes(emojiCode.eLove); // eslint-disable-next-line
    }, []);
    return (       
        <Accordion.Item eventKey={post.idx.toString()}>
            <Accordion.Header>
                <h2>{post.title}</h2>
            </Accordion.Header>
            <Accordion.Body>
                <p>{post.description}</p>
                <p>@{post.username}</p>
                    <button style={{border: "none"}} onClick={hasUserLiked ? () => onRemoveLike(emojiCode.eLike) : () => onAddLike(emojiCode.eLike)}>
                        { hasUserLiked ? (<>&#128078;</>) : (<>&#128077;</>) }                     
                    </button>
                    {likeCount && ( <>Likes : {likeCount?.length}</>)}                
                <p style={{padding: "5px"}}>
                    <button style={{border: "none",marginLeft: "10px", marginRight: "6px", backgroundColor: "buttonface"}} 
                            onClick={hasUserLoved ? () => onRemoveLike(emojiCode.eLove) : () => onAddLike(emojiCode.eLove)}
                            className={hasUserLoved ?  "heart2Red" : "heart2"}> 
                    </button>
                    {loveCount && ( <>Loves : {loveCount?.length}</>)} 
                </p>
            </Accordion.Body>
        </Accordion.Item>     
    )
}