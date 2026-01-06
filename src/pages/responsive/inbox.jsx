import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "../../conectionAPI/firebase";
import { auth } from "../../conectionAPI/firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

function Inbox() {

  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noAuth, setNoAuth] = useState(false);

  useEffect(() => {
    const senderId = auth.currentUser?.uid;
    if (!senderId) {
      setNoAuth(true);
      setLoading(false);
      return;
    }
    async function fetchChats() {
      const chatsRef = collection(db, "chats");
      const snapshot = await getDocs(chatsRef);
      const chatList = [];
      for (const chatDoc of snapshot.docs) {
        const chatId = chatDoc.id;
        const ids = chatId.split("_");
        if (!ids.includes(senderId)) continue;
        const otherId = ids.find(id => id !== senderId);
        if (!otherId) continue;
        // Verificar si hay mensajes en el chat
        const messagesRef = collection(db, "chats", chatId, "messages");
        const messagesSnap = await getDocs(messagesRef);
        console.log(`chatId: ${chatId}, mensajes: ${messagesSnap.size}`);
        if (messagesSnap.empty) continue; // Solo mostrar si hay mensajes
        const userSnap = await getDoc(doc(db, "users", otherId));
        chatList.push({
          chatId,
          user: userSnap.exists() ? userSnap.data() : { email: otherId },
          userId: otherId
        });
      }
      setChats(chatList);
      setLoading(false);
    }
    fetchChats();
  }, []);

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});
  return (
    <div style={{ height: "100vh", width: "100%", background: "#f0f0f0ff"}}>
      <React.Fragment>
        <CssBaseline />
        <Paper square sx={{ pb: '50px' }}>
          <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0, textAlign: 'center' }}>
            Inbox
          </Typography>
          {loading ? (
            <Typography sx={{ p: 2, textAlign: 'center' }}>Cargando...</Typography>
          ) : noAuth ? (
            <Typography sx={{ p: 2, textAlign: 'center', color: 'red' }}>Debes iniciar sesión para ver tus chats.</Typography>
          ) : chats.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: 'center' }}>No tienes chats.</Typography>
          ) : (
            <List sx={{ mb: 2 }}>
              {chats.map((chat) => (
                <ListItemButton key={chat.chatId} onClick={() => navigate(`/inbox/${chat.userId}`)}>
                  <ListItemText primary={chat.user.email} secondary={chat.user.name || chat.userId} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </React.Fragment>
    </div>
  );
}

export default Inbox
