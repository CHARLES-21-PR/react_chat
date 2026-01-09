import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { auth } from '../conectionAPI/firebase';

function Welcome() {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#314a64ff', textAlign: 'center' }}>
        ¡Bienvenido a SpeedChat!
        {auth.currentUser ? `, ${auth.currentUser.email}` : ''}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        Selecciona un chat, busca usuarios o comienza una nueva conversación desde el menú.
      </Typography>
    </Box>
  );
}

export default Welcome;
