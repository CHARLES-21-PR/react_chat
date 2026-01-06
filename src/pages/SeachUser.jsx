import React from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../conectionAPI/firebase"
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import CommentIcon from '@mui/icons-material/Comment';



const Demo = styled('div')(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

function SeachUser() {
      const { setSelectedUser } = useOutletContext();
    const [userFirebase, setUserFirebase] = useState([]);
    const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

    useEffect( () => {
      const fetchUser = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserFirebase(lista);
      };
      fetchUser();
    }, []);

    const navigate = useNavigate();

    const [isResponsive, setIsResponsive] = useState(window.innerWidth < 900);
  useEffect(()=> {
    const checkSize = () => {
      setIsResponsive(window.innerWidth < 900);
    } 
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  } , []);

  function handleInboxClick(user) {
    if (isResponsive) {
      navigate(`/inbox/${user.id}`);
    } else {
      setSelectedUser(user);
    }
  }

  return (
    <div style={{ height: "100vh", width: "100%", padding: "20px", background: "#f0f0f0ff"}}>
      <h2>Buscar Usuarios</h2>
      <br />
      <Box sx={{ flexGrow: 1 }}>
        
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            
            <Demo>
              <List dense={dense}>
                {userFirebase.map((user, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comment" onClick={() => handleInboxClick(user)}>
                        <CommentIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt={`Avatar n°${index + 1}`}
                  src={`/static/images/avatar/${index + 1}.jpg`}/>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name ? user.name : "Usuario"}
                      secondary={user.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Demo>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default SeachUser;