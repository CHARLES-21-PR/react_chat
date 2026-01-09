import { useEffect, useState } from 'react'

import Pagechat from './pages/Pagechat'
import Login from './auth/Login'
import SeachUser from './pages/SeachUser'
import ListFriend from './pages/ListFriend'
import ChatResponsive from './pages/responsive/ChatResponsive'
import Inbox from './pages/responsive/inbox'
import Welcome from './pages/Welcome'
import Profile from '././auth/Profile'
import GeneralChat from './pages/GeneralChat'
import { auth } from "./conectionAPI/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 900);
  useEffect(()=> {
    const checkSize = () => {
      setIsResponsive(window.innerWidth < 900);
    } 
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  } , []);

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={user ? <Pagechat setUser={setUser} /> : <Login setUser={setUser} />}>
              <Route index element={<Welcome />} />
              <Route path='search' element={<SeachUser />} />
              <Route path='friends' element={<ListFriend />} />
              <Route path='generalChat' element={<GeneralChat />} />
              <Route path='profile' element={<Profile />} />
              <Route path='inbox' element={<Inbox />} />
              <Route path='inbox/:uid' element={isResponsive ? <ChatResponsive /> : <Pagechat />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
