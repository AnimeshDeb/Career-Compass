import { useState } from 'react';
import { auth, googleProvider } from './Config/firebase-config'
import { createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async() =>{
        try{
            const result = await createUserWithEmailAndPassword(auth, email, password);
            cookies.set("auth-token", result.user.refreshToken);
        } catch(err){
            console.error(err);
        }
        
    };

    const signInWithGoogle = async() =>{
        try{
            const result = await signInWithPopup(auth, googleProvider);
            cookies.set("auth-token", result.user.refreshToken);
        } catch(err){
            console.log(err);
        }
    };
    
    return(
        <div>
            <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)}>

            </input>
            <input placeholder="Password..." onChange={(e) => setPassword(e.target.value)} type='password'>
                
            </input>
            <button onClick={signIn}>Sing In</button>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    );
}