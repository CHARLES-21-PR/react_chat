import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from "../../conectionAPI/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

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
    (async () => {
      const chatsRef = collection(db, "chats");
      const snapshot = await getDocs(chatsRef);
      const chatList = [];
      for (const chatDoc of snapshot.docs) {
        const chatId = chatDoc.id;
        const ids = chatId.split("_");
        if (!ids.includes(senderId)) continue;
        const otherId = ids.find(id => id !== senderId);
        if (!otherId) continue;
        const messagesSnap = await getDocs(collection(db, "chats", chatId, "messages"));
        if (messagesSnap.empty) continue;
        const userSnap = await getDoc(doc(db, "users", otherId));
        chatList.push({
          chatId,
          user: userSnap.exists() ? userSnap.data() : { email: otherId },
          userId: otherId
        });
      }
      setChats(chatList);
      setLoading(false);
    })();
  }, []);

  return (
    <Paper square sx={{ height: '100vh', width: '100%', background: '#f0f0f0ff', pb: '50px' }}>
      <CssBaseline />
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
  );
}

export default Inbox
