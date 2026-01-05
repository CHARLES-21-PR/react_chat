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
    <div>
        <form onSubmit={submitHundler}>
            { isRegistered ? <h2>Iniciar Sesión</h2> : <h2>Registrarse</h2> }
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" />
        <br />
        <button type="submit">{ isRegistered ? "Iniciar Sesión" : "Registrarse" }</button>
        </form>
        <button onClick={() => setIsRegistered(!isRegistered)}>
            { isRegistered ? "¿No tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión" }
        </button>
    </div>
    
  )
}

export default Login