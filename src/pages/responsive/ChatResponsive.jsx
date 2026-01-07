import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../conectionAPI/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

function ChatResponsive() {
  const { uid } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchUserByUid() {
      if (uid) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setSelectedUser({ id: uid, ...userSnap.data() });
        } else {
          setSelectedUser(null);
        }
      } else {
        setSelectedUser(null);
      }
    }
    fetchUserByUid();
  }, [uid]);

  useEffect(() => {
    if (!selectedUser) return;
    const chatId = [auth.currentUser.uid, selectedUser.id].sort().join('_');
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const now = new Date();
      setMessages(
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((msg) => {
            if (!msg.expiresAt) return true;
            const exp = msg.expiresAt.toDate ? msg.expiresAt.toDate() : new Date(msg.expiresAt);
            return exp > now;
          })
      );
    });
    return () => unsub();
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const senderId = auth.currentUser.uid;
    const receiverId = selectedUser?.id || uid;
    if (!receiverId) {
      alert('No hay usuario receptor seleccionado');
      return;
    }
    const chatId = [senderId, receiverId].sort().join('_');
    // Expira en 24 horas (86400 segundos)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId,
      receiverId,
      createdAt: serverTimestamp(),
      expiresAt,
    });
    setText("");
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', background: '#f0f0f0ff', display: 'flex', position: 'relative', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ p: 2, textAlign: 'center', background: '#314a64ff', color: 'white' }}>
        {selectedUser ? `Chat con: ${selectedUser.email}` : 'Selecciona un usuario'}
      </Typography>
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', marginBottom: '80px' }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === auth.currentUser.uid;
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                mb: 7,
              }}
            >
              <Box
                sx={{
                  maxWidth: '80%',
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: isMine ? '#1976d2' : '#e0e0e0',
                  color: isMine ? '#fff' : '#000',
                }}
              >
                {msg.text}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 56, p: 2, borderTop: '1px solid #ccc', background: '#f0f0f0ff', zIndex: 10 }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
          <FormControl sx={{ flex: 1 }}>
            <OutlinedInput
              placeholder="Escribe un mensaje"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!selectedUser}
            />
          </FormControl>
          <button type="submit" disabled={!selectedUser || !text.trim()} style={{ padding: '8px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4 }}>
            Enviar
          </button>
        </form>
      </Box>
    </Box>
  );
}

export default ChatResponsive;
