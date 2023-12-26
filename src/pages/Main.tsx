import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { Post as DisplayPost } from "./Post";
import { Accordion } from "react-bootstrap";
export interface Post {
    id: string;
    userId: string;
    title: string;
    username: string;
    description: string;
    idx: number;
}
export const Main = () => {
    const [postsList, setPostsList] = useState<Post[] | null>(null);
    const postsRef = collection(db, "posts");
    const getPosts = async () => {
        const data = await getDocs(postsRef);
        //console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        setPostsList(
            data.docs.map((doc,idx) => ({...doc.data(), id: doc.id, idx: idx})) as Post[]
        );
    }

    useEffect(() => {
        getPosts();
    }, []);
    return (
        <div>
            <h1>Main Page</h1>
            <Accordion defaultActiveKey={"0"} flush>
                {postsList?.map((post) => (<DisplayPost post={post}/>))}
            </Accordion>
        </div>
    );
}