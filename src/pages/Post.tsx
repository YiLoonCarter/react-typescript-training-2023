import { Post as IPost } from "./Main"
import { db, auth } from "../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
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
        <div>
            <div className="title"><h1>{post.title}</h1></div>
            <div className="body"><p>{post.description}</p></div>
            <div className="footer">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? onRemoveLike : onAddLike}> { hasUserLiked ? (<>&#128078;</>) : (<>&#128077;</>) }</button>
                {likeCount && (<p> Likes : {likeCount?.length}</p>)}
            </div>
        </div>
    )
}