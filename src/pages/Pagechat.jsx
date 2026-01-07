import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { db } from "../conectionAPI/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../conectionAPI/firebase"
import { signOut } from "firebase/auth";
import { styled, useTheme } from '@mui/material/styles';
import { Link, Outlet } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth" 
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PeopleIcon from '@mui/icons-material/People';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import SettingsIcon from '@mui/icons-material/Settings';
import SeachUser from '../pages/SeachUser';
import { Navigate, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

const drawerWidth = 240;
const settings = [
    { name: 'Profile',
      Icon:   <AccountBoxIcon />
     },
    { name: 'Logout',
      Icon:   <LogoutIcon />
    }
];

const menuItems = [
  {
    text: 'Buscar Usuario',
    icon: <PersonSearchIcon />, 
    to: 'search'
  },
  {
    text: 'Amigos',
    icon: <PeopleIcon />,
    to: 'friends'
  }
]
  
  
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);


function MyFormHelperText() {
  const { focused } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (focused) {
      return 'This field is being focused';
    }

    return 'Helper text';
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

function Pagechat(props) {
    const { uid } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
      async function fetchUserByUid() {
        if (uid) {
          const userRef = doc(db, "users", uid);
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

    const [anchorElUser, setAnchorElUser] = React.useState(null);

  
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
        signOut(auth);
        props.setUser(null);
    }
  }



    const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  /* Mensajeria */
   const [text, setText] = useState("");
  const auth = getAuth();
  

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const senderId = auth.currentUser.uid;
    // receiverId debe ser el id del usuario seleccionado
    const receiverId = selectedUser?.id || uid;
    if (!receiverId) {
      alert("No hay usuario receptor seleccionado");
      return;
    }
    const chatId = [senderId, receiverId].sort().join("_");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId,
      receiverId,
      createdAt: serverTimestamp(),
    });

    setText(""); 
    };

    const [messages, setMessages] = useState([]);

    useEffect(() => {
      if (!selectedUser) return;

      const chatId = [auth.currentUser.uid, selectedUser.id]
        .sort()
        .join("_");

      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
      );

      const unsub = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return () => unsub();
    }, [selectedUser]);

  /*Responsive*/
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 return (
    <div style={{  }}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#314a64ff" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className='menuHamburger'
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon className='menuHamburger' />
          </IconButton>
          <Box sx={{ display: 'flex', justifyContent: 'space-between',  width: '100%' }}>
            <Typography variant="h6" noWrap component="div">
            SpeedChat
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={() => handleMenuClick(setting.name)}>
                  <Typography sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>{setting.Icon} {setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} className='sideBar'>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              {item.to ? (
                <ListItemButton
                  component={Link}
                  to={item.to}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
          
              <Outlet context={{ setSelectedUser }} />
        </div>
        
      </Box>



      <Drawer
  sx={{
    width: 300,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 300,
      boxSizing: 'border-box',
      
    },
  }}
  variant="permanent"
  anchor="right"
  className="sideBar"
>
  <Toolbar />
  <Divider />

  {/* 👤 USUARIO SELECCIONADO */}
  <List>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {selectedUser ? <PersonIcon /> : <WavingHandIcon />}
        </ListItemIcon>
        <ListItemText
          primary={
            selectedUser
              ? ` ${selectedUser.email}`
              : "No hay usuario seleccionado"
          }
        />
      </ListItemButton>
    </ListItem>
  </List>

  <Divider />

  {/* 💬 MENSAJES */}
  <Box
    sx={{
      flexGrow: 1,
      p: 2,
      overflowY: "auto",
      height: "calc(100vh - 200px)",
    }}
  >
    {messages.map((msg) => {
      const isMine = msg.senderId === auth.currentUser.uid;

      return (
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: isMine ? "flex-end" : "flex-start",
            mb: 1,
          }}
        >
          <Box
            sx={{
              maxWidth: "80%",
              p: 1,
              borderRadius: 2,
              backgroundColor: isMine ? "#1976d2" : "#e0e0e0",
              color: isMine ? "#fff" : "#000",
            }}
          >
            {msg.text}
          </Box>
        </Box>
      );
    })}
  </Box>

  <Divider />

  {/* ✉️ INPUT DE ENVÍO */}
  <Box sx={{ p: 2 }}>
    <form onSubmit={sendMessage}>
      <FormControl sx={{ width: "100%" }}>
        <OutlinedInput
          placeholder="Escribe un mensaje"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!selectedUser}
        />
      </FormControl>
    </form>
  </Box>
</Drawer>


    </Box>
    
    <Box className='sideBarResponsive' sx={{ width: "100%" }}>
        <BottomNavigation sx={{ width: "100%", position: "fixed", bottom: 0 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Buscar"
        value="recents"
        icon={<PersonSearchIcon />}
        component={Link}
        to='search'
      />
      <BottomNavigationAction
        label="Amigos"
        value="favorites"
        icon={<PeopleIcon />}
        component={Link}
        to='friends'
      />
      <BottomNavigationAction
        label="Inbox"
        value="nearby"
        icon={<MailIcon />}
        component={Link}
        to='inbox'
      />
      <BottomNavigationAction label="Settings" value="folder" icon={<SettingsIcon />} />
    </BottomNavigation>
    </Box>
    
    </div>
    
  )
}

export default Pagechat