import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Pagechat from './pages/Pagechat'
import Login from './auth/Login'
import { auth } from "./conectionAPI/firebase"
import { onAuthStateChanged } from "firebase/auth";

import './App.css'

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <>
      {user ? <Pagechat setUser={setUser} /> : <Login setUser={setUser} />}
    </>
  )
}

export default App
