import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Navbar as BsNavBar, Container, Nav } from "react-bootstrap";
export const Navbar = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const signUserOut = async () => {
        await signOut(auth);
        navigate("/");
    }
    return (
        <BsNavBar className="bg-body-tertiary" expand="lg">
          <Container>          
          <BsNavBar.Toggle aria-controls="basic-navbar-nav" />
          <BsNavBar.Collapse id="basic-navbar-nav">
          <Nav className="links me-auto">
          <Nav.Link><Link to="/"> Home </Link></Nav.Link>
            {user && <Nav.Link><Link to="/main"> Main </Link></Nav.Link>}
            {user && <Nav.Link><Link to="/chatroom"> Chatroom </Link></Nav.Link>}
            {user && <Nav.Link><Link to="/imgupload"> Image Upload </Link></Nav.Link>}
            {user && <Nav.Link><Link to="/prodinv"> Product Inventory </Link></Nav.Link>}
            {user && <Nav.Link><Link to="/prodlist"> Products List </Link></Nav.Link>}
            {user && <Nav.Link><Link to="/shoppingcart"> Shopping Cart </Link></Nav.Link>}
            {!user ? 
            (<Nav.Link><Link to="/login"> Login </Link></Nav.Link>)
            :                        
            (<Nav.Link><Link to="/createpost"> Create Post </Link></Nav.Link>)
            }
            
          </Nav>
          </BsNavBar.Collapse>
          <div className="user">
            {user && (
              <>
                <p> {user?.displayName} </p>
                <img alt="profilepicture" src={user?.photoURL || ""} width="20" height="20" />
                <button onClick={signUserOut}>Log Out</button>
              </>
            )}
          </div>
          </Container>
        </BsNavBar>         
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