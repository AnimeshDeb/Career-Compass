import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useRef } from "react";
import { useAuth } from "../../../Contexts/SeekerAuthContext";
import { v4 } from "uuid";
function SeekerSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //we have a loading state so that the user doesnt keep clicking the button
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); //prevents form from refreshing
    //checkign below if the passwords match in confirm password confirm and the password sections
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError(""); // set error back to empty string so that we dont have error initially
      setLoading(true); //loading is set to true since the user has clicked the signup button.
      const newName =
        fullNameRef.current.value
          .split("")
          .filter((char) => char !== " ")
          .join("") + v4();
      await signup(emailRef.current.value, passwordRef.current.value, newName); // Here we call the signup function, which is in AuthContexts file with certain parameters. If signup does not work then error will be outputted

      navigate("/parent", { state: { fullName: newName } }); //If signup is successful, then user is navigated to the user page, else they get an error as signup wouldn't have been successful.
      //using await, we wait for signup to finish
    } catch (error) {
      //error message that will be displayed in case the signup process isnt succesful
      setError(error.message);
    }
    setLoading(false); //once user signs up, loading is set to false as the process is finished.
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* In the signup, we require the users email, password, and display name. After clicing the sign up button,
          we make a call to the signup function in AuthContexts so that the information is saved in the firebase database
          and then the user successfully logs in. */}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="fullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="fullname" ref={fullNameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign up
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/SeekerLogin">Log In</Link>
      </div>
    </>
  );
}

export default SeekerSignup;
