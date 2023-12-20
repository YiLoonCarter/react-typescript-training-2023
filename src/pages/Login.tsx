import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export const Login = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
      const result = await signInWithPopup(auth, provider);
      //console.log(result);
      navigate("/main");
    };
    return (
        <div>
            <h1>Login Page</h1>
            <p>Sign In with Google To Continue</p>
            <button onClick={signInWithGoogle}> Sign In with Google</button>
        </div>
    );
}

/*
import { useState } from "react"
import { login, logout } from "../store";
import { useDispatch, useSelector } from "react-redux";
export const Login = () => {
    const [newUsername, setNewUsername] = useState<string>("");
    const [newAge, setNewAge] = useState<number>(0);
    const dispatch = useDispatch();
    const username = useSelector((state: any) => state.user.value.username);
    const age = useSelector((state: any) => state.user.value.age);
    return ( 
        <div>
            <h1>This is Login Page</h1>
            <h1>{username} with age {age}</h1>
            <label>Username : </label><input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     setNewUsername(e.target.value);
                   }} 
            />
            <br/>
            <label>Age : </label><input type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     setNewAge(e.target.valueAsNumber);
                   }} 
            />
            <br/>
            <button onClick={() => dispatch(login({username: newUsername, age: newAge}))}> Submit Login </button>
            <button onClick={() => dispatch(logout())}> Submit Logout </button>
        </div>
    );
};
*/