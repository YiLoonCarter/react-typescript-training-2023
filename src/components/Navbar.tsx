import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
export const Navbar = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const signUserOut = async () => {
        await signOut(auth);
        navigate("/");
    }
    return ( 
        <div className="navbar">
          <div className="links">
            <Link to="/"> Home </Link>
            {user && <Link to="/main"> Main </Link>}
            {!user ? 
            (<Link to="/login"> Login </Link>)
            :                        
            (<Link to="/createpost"> Create Post </Link>)
            }
          </div>
          <div className="user">
            {user && (
              <>
                <p> {user?.displayName} </p>
                <img alt="profilepicture" src={user?.photoURL || ""} width="20" height="20" />
                <button onClick={signUserOut}>Log Out</button>
              </>
            )}
          </div>
        </div>        
    );
}

/*

import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
export const Navbar = () => {
    return ( 
        <div>
          <Link to="/"> Main </Link>
          <Link to="/login"> Login </Link>
          <div>
            <p> {auth.currentUser?.displayName} </p>
            <img src={auth.currentUser?.photoURL || ""} width="100" height="100" />
          </div>
        </div>        
    );
}

*/