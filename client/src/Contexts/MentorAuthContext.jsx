import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as updatePasswordInAuth,
} from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const MentorAuthContext = React.createContext();

export function useAuth() {
  return useContext(MentorAuthContext);
}

// value returns the things we want from the authentication
//using firebase function to reset password below with only required parameters being auth and email.
async function resetpassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export { resetpassword };

export function MentorAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(email, password, fullName) {
    try {
      //in below three lines, we are instantiating variables to refer to user data, such as their uid that is generated in firebase, email, and password.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      console.log(user.uid);
      const userDocRef = doc(db, "Mentors", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        password: password,
        displayName: fullName,
        UID: user.uid,
        // Consider if you really need to store UID explicitly since it's already the document ID
      });
      return userCredential;
    } catch (error) {
      //error will be thrown in case there was some issue in creating the account (such as user having same display name that
      //already exists in the database.)
      console.error("Error creating account:", error);
      throw error;
    }
  }

  function login(email, password) {
    //using firebase function signInWithEmailAndPassword to handle the login function. We just have to pass in appropriate parameters
    // such as the auth itself, user email, and user password.
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    //Using firebase function of signOut to log out the user. Only parameter that we need to pass in is auth.
    return signOut(auth);
  }

  //using firebase function to update email (would be found in the update profile option in user page)
  function updateemail(email) {
    return currentUser.updateEmail(email);
  }

  //using firebase function to update password
  function updatePassword(password) {
    return updatePasswordInAuth(currentUser, password);
  }

  useEffect(() => {
    //function returns a method that when we call the method it will unsubscribe the on off auth state changed
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      //did verification with the user
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  //We list all the functions in addition to the reference to the current user, so that they are accessible properly
  // in the other pages/ files.
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetpassword,
    updateemail,
    updatePassword,
  };

  return (
    <MentorAuthContext.Provider value={value}>
      {!loading && children}
    </MentorAuthContext.Provider>
  );
}