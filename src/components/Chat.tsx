import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, onSnapshot, orderBy, query, where, Timestamp } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
interface Props {
    room: string;
}
interface Message {
    id: string;
    text: string;
    user: string;
    room: string;
    createdAt: Timestamp;
    userId: string;
}
export const Chat = (props: Props) => {
    const [user] = useAuthState(auth);
    const {room} = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[] | null>(null);
    const messagesRef = collection(db, "messages");
    //listening to changes
    useEffect(() => {
      const queryMessages = query(
        messagesRef, 
        where("room", "==", room), 
        orderBy("createdAt") //required to add index in Firebase Collection = messages
      );
      const unscribe = onSnapshot(queryMessages, (snapshot) => {
        //console.log(newMessage);
        //let messages = [];
        setMessages(
            snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})) as Message[]
        );
        //snapshot.forEach((doc) => {
        //  messages.push({...doc.data(), id: doc.id });
        //});
        //setMessages(messages);
      });
      return () => unscribe();
    },[])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); //Prevent page reload
      //console.log(newMessage);
      if (newMessage === "") return;
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: user?.displayName,
        room,
        userId: user?.uid,
      });
      setNewMessage("");
    };
    return (
      <div className="chat-app">
        <div className="header">
          <h1>Welcome to {room.toUpperCase()}</h1> 
        </div>
        <div className="messages"> 
          {messages?.map((message) => (
            <div className="message" key={message.id}>
              <span className="user" style={{fontWeight: "bold", paddingRight: "5px"}}>{message.user} : </span>
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="new-message-form" style={{width: "100%" }}>
          <input
            className="new-message-input"
            placeholder="Type your message here..." 
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    );
};