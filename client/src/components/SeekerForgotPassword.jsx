import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useRef } from "react";
import { useAuth } from "../Contexts/SeekerAuthContext";

function SeekerForgotPassword() {
  const emailRef = useRef();
  const { resetpassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  //we have a loading state so that the user doesnt keep clicking the button
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); //prevents form from refreshing
    //checking below if password is same as whats in db

    try {
      setMessage("");
      setError(""); // set error back to empty string so that we dont have error
      setLoading(true);
      await resetpassword(emailRef.current.value); //Using resetpassword function with appropriate parameters passed in. It should
      // be noted that since we are using useAuth for this, firebase handles the functionality of the user resetting the password.
      // It handles the logic of the user receiving an email with their password once they type their email and submit.
      setMessage("Check your email for further instructions");
      //using await, we wait for signup to finish
    } catch (error) {
      console.error("Failed to reset email, error is:  ", error);
      setError("Failed to reset password");
    }
    setLoading(false);
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/SeekerLogin">Log In</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/SeekerSignup">Sign Up</Link>
      </div>
    </>
  );
}

export default SeekerForgotPassword;
