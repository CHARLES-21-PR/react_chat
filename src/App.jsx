import { useState } from 'react'

import Pagechat from './pages/Pagechat'
import Login from './auth/Login'
import SeachUser from './pages/SeachUser'
import ListFriend from './pages/ListFriend'
import Inbox from './pages/responsive/inbox'
import { auth } from "./conectionAPI/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={user ? <Pagechat setUser={setUser} /> : <Login setUser={setUser} />}>
              <Route index path='search' element={<SeachUser />} />
              <Route path='friends' element={<ListFriend />} />
              <Route path='inbox' element={<Inbox />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
