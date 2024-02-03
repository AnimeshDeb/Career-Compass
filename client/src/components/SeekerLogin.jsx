import { useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import React, { useRef } from "react";
import {useAuth} from "../Contexts/SeekerAuthContext"
import SeekerForgotPassword from "./SeekerForgotPassword";

function SeekerLogin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate=useNavigate();
  const {login}=useAuth();
  const [error, setError]=useState('')
  //we have a loading state so that the user doesnt keep clicking the button
  const [loading, setLoading]=useState(false)
  async function handleSubmit(e){
    e.preventDefault()//prevents form from refreshing
    //checking below if password is same as whats in db
   
    try{

    setError('')// set error back to empty string so that we dont have error
    setLoading(true)
    await login(emailRef.current.value, passwordRef.current.value)// We are calling the login function from AuthContexts with appropriate parameters and
    //if login does not work then error will be outputted
     navigate('/SeekerUser')
    //using await, we wait for signup to finish
  } catch (error) {
    console.error("Error signing in: ", error);
      setError('Failed to sign in')

    }
    setLoading(false)
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Similar fields as in the signup page are displayed, requiring users to enter their credentials to login. */}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/SeekerForgotPassword">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/SeekerSignup">Sign Up</Link>
      </div>
    </>
  );
}

export default SeekerLogin;