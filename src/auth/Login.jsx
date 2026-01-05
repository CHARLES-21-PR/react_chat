import React from 'react'
import { useState, useEffect } from 'react'
import { auth } from "../conectionAPI/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../conectionAPI/firebase";
import { setDoc, doc } from "firebase/firestore";

function Login(props) {
    const [isRegistered, setIsRegistered] = useState(true)
    function submitHundler(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (isRegistered){
            loginUser(email, password);
        }
        else{
            registerUser(email, password);
        }
    }

    async function registerUser(email, password){
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Guardar en Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                uid: user.uid
            });
            alert("Usuario registrado: " + user.email);
        } catch (error) {
            alert("Error al registrar usuario: " + error.message);
        }
    }

    function loginUser(email, password){
        signInWithEmailAndPassword(auth, email, password)
        .then(userFirebase => {
            alert("Usuario logueado:" + userFirebase.user.email);
        })
        .catch(error => {
            alert("Error al loguear usuario:" + error.message);
        });
        props.setUser(userFirebase.user);
    }
    
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",width: "100%", background: "#ffffffff" }}>
        <div style={{ background: "#222745ff", maxWidth: 400, padding: 20, borderRadius: 10, color: "white", boxShadow: "0 0 10px rgba(0,0,0,0.5)", padding: "30px 20px" }}>
            <form onSubmit={submitHundler} style={{display: 'flex', flexDirection: 'column', maxWidth: 300, textAlign: 'center'}}>
             { isRegistered ? <h2 className='titleLoginRegister'>Iniciar Sesión</h2> : <h2 className='titleLoginRegister'>Registrarse</h2> }
            <br />
            <label htmlFor="email" style={{ textAlign: "left" }}>Email:</label>
            <input type="email" id="email" />
            <br />
            <label htmlFor="password" style={{ textAlign: "left" }}>Password:</label>
            <input type="password" id="password" />
            <br />
            <button type="submit">{ isRegistered ? "Iniciar Sesión" : "Registrarse" }</button>
            </form>
            <br />

            <button onClick={() => setIsRegistered(!isRegistered)}>
                { isRegistered ? "¿No tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión" }
            </button>
        </div>
    </div>
    
  )
}

export default Login