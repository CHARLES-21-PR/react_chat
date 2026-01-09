import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../conectionAPI/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

function GeneralChat() {
      const messagesEndRef = React.useRef(null);
    const { uid } = useParams();
      
      const [messages, setMessages] = useState([]);
      const [text, setText] = useState("");

      useEffect(() => {
          async function fetchUserByUid() {
            if (uid) {
              const userRef = doc(db, 'users', uid);
              const userSnap = await getDoc(userRef);
              
            } 
          }
          fetchUserByUid();
        }, [uid]);
      
        useEffect(() => {
           const q = query(
                collection(db, 'chatGeneral'),
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
        }, []);

        // Scroll automático al último mensaje
        useEffect(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, [messages]);
      
        const sendMessage = async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          const senderId = auth.currentUser.uid;
          const senderEmail = auth.currentUser.email;
          let senderName = auth.currentUser.displayName || 'Desconocido';
          // Buscar nombre personalizado en Firestore
          try {
            const userRef = doc(db, 'users', senderId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              if (data.name) senderName = data.name;
            }
          } catch (err) {}
          const receiverId = "generalChat";
          // Expira en 24 horas (86400 segundos)
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await addDoc(collection(db, 'chatGeneral'), {
            text,
            senderId,
            senderEmail,
            senderName,
            receiverId,
            createdAt: serverTimestamp(),
            expiresAt,
          });
          setText("");
        };

        const [isResponsive, setIsResponsive] = useState(window.innerWidth < 900);
          useEffect(()=> {
            const checkSize = () => {
              setIsResponsive(window.innerWidth < 900);
            } 
            window.addEventListener('resize', checkSize);
            return () => window.removeEventListener('resize', checkSize);
          } , []);

  return (
    <Box sx={{ width: '100%', height: '100vh', background: '#f0f0f0ff', display: 'flex', position: 'relative', flexDirection: 'column' }}>
      
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', marginBottom: '110px' }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === auth.currentUser.uid;
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                mb: 1,
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
                <strong style={{color: isMine ? '#e0e0e0' : '#1976d2'}}>{isMine ? 'Tú' : msg.senderName}:</strong> {msg.text}
                {msg.createdAt && (
                  <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5 }}>
                    {new Date(msg.createdAt.seconds * 1000).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ position: isResponsive ? 'fixed' : 'relative', left: 0, right: 0, bottom: 56, p: 1, borderTop: '1px solid #ccc', background: '#f0f0f0ff', zIndex: 10 }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
          <FormControl sx={{ flex: 1 }}>
            <OutlinedInput
              placeholder="Escribe un mensaje"
              value={text}
              onChange={(e) => setText(e.target.value)}
              
            />
          </FormControl>
          <button type="submit" disabled={!text.trim()} style={{ padding: '8px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4 }}>
            Enviar
          </button>
        </form>
      </Box>
    </Box>
  )
}

export default GeneralChat