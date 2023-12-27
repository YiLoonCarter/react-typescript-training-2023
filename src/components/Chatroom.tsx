import { useState, useRef } from 'react';
import { Chat } from './Chat';
export const Chatroom = () => {
    const [room, setRoom] = useState<string>("");
    const roomInputRef = useRef<HTMLInputElement | null>(null);
    //const setChatroom = () => {
        //console.log(roomInputRef.current?.value);
        //if (roomInputRef.current){
        //    setRoom(roomInputRef.current?.value);
        //}
        //() => setChatroom()
        //() => setRoom(roomInputRef.current)
    //}
    return (
        <>
          {room ? (
            <>
              <Chat room={room} />
              <div className="check-out">
                <button onClick={() => setRoom("")}>Back</button>
              </div>
            </>
          ) : (
            <>
              <div className="room">
                <label>Enter Room Name:</label>
                <input ref={roomInputRef} />
                <button onClick={() => setRoom(roomInputRef.current ? roomInputRef.current.value : "")}> Enter Chat </button>
              </div>
            </>
          )}
        </>
      );
}