import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { db, auth } from '../conectionAPI/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function Profile() {
    const [name, setName] = React.useState('');
    const [Email, setEmail] = React.useState(auth.currentUser?.email || '');

    React.useEffect(() => {
      // Cargar nombre actual del usuario si existe
      const fetchUser = async () => {
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setName(data.name || auth.currentUser.displayName || '');
            setEmail(data.email || auth.currentUser.email || '');
          } else {
            setName(auth.currentUser.displayName || '');
            setEmail(auth.currentUser.email || '');
          }
        } else {
          setName('');
          setEmail('');
        }
      };
      fetchUser();
    }, [auth.currentUser?.uid]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
        email: Email,
      });
      alert('Datos actualizados');
    };
  return (
    <div style={{ height: "100vh", width: "100%", padding: "20px", background: "#f0f0f0ff", textAlign: 'center'}}>
      <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0, textAlign: 'center' }}>
        Perfil de Usuario
      </Typography>
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="outlined-controlled"
          label="Nombre"
          value={name}
          sx={{ background: "#ffffff" }}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          id="outlined-uncontrolled"
          label="Email"
          value={Email}
          sx={{ background: "#ffffff" }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <button type='submit'>Guardar</button>
      </Box>
    </div>
  )
}

export default Profile