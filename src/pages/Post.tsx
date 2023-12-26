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
}

export const Post = (props: Props) => {
    const { post } = props;
    const [user] = useAuthState(auth);
    const [likeCount, setLikeCount] = useState<Like[] | null>(null);
    const likesRef = collection(db, "likes");
    const likesDoc = query(likesRef, where("postId", "==", post.id));
    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        //console.log(data.docs.length);
        setLikeCount(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})));
    }
    const onAddLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
            userId: user?.uid, 
            postId: post.id
            });
            if(user){
            setLikeCount((prev) => 
                prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] 
                : [{userId: user?.uid, likeId: newDoc.id}]);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const onRemoveLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef, 
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
                );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);
            await deleteDoc(likeToDelete);
            if(user){
            setLikeCount((prev) => 
                prev && prev.filter((like) => like.likeId !== likeId)
              );
            }
        } catch (err) {
            console.log(err);
        }
    }
    const hasUserLiked = likeCount?.find((like) => like.userId === user?.uid)
    useEffect(() => {
        getLikes();
    }, []);
    return (       
        <Accordion.Item eventKey={post.idx.toString()}>
            <Accordion.Header>
                <h2>{post.title}</h2>
            </Accordion.Header>
            <Accordion.Body>
                <p>{post.description}</p>
                <p>@{post.username}</p>
                    <button style={{border: "none"}} onClick={hasUserLiked ? onRemoveLike : onAddLike}>
                        { hasUserLiked ? (<>&#128078;</>) : (<>&#128077;</>) }                     
                    </button>
                    {likeCount && ( <>Likes : {likeCount?.length}</>)}                
                <p style={{padding: "5px"}}>
                    <button style={{border: "none",marginLeft: "10px", marginRight: "6px", backgroundColor: "buttonface"}} 
                            onClick={hasUserLiked ? onRemoveLike : onAddLike}
                            className={hasUserLiked ?  "heart2Red" : "heart2"}> 
                    </button>
                    {likeCount && ( <>Loves : {likeCount?.length}</>)} 
                </p>
            </Accordion.Body>
        </Accordion.Item>     
    )
}