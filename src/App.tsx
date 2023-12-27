//import { Person, Country } from './components/Person';
//import { Home } from './pages/Home';
//import { Login } from './pages/Login';
//import { Contact } from './pages/Contact';
//import { Provider } from 'react-redux';
//import { store } from './store';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { CreatePost } from './pages/create-post/create-post';
import { Home } from './pages/Home';
import { Chatroom } from './components/Chatroom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/main" element={<Main />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/createpost" element={<CreatePost />}/>
          <Route path="/chatroom" element={<Chatroom />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

/*
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Contact } from './pages/Contact';
import { Provider } from 'react-redux';
import { store } from './store';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Link to="/"> Home </Link>
          <Link to="/login"> Login </Link>
          <Link to="/contact"> Contact </Link>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/contact" element={<Contact />}/>
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

import { Person, Country } from './components/Person';
function App() {
  const getAge = (name: string): number => {
    return 99;
  }
  return (
    <div className="App">
      <Person 
        name={"Carter"}
        email={"carter@gmail.com"}
        age={18}
        isMarried={true}
        friends={["John","Jessica"]}
        country={Country.Japan}
      />
    </div>
  );
}
*/