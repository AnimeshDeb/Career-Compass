import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Contexts/AuthContext";

//Taking changeColor as a parameter here. 'changeColor' is coming from the app.js file. Remember that 'changeColor' is a function that is equivalent to 'changeBackgroundColor' function.
function AdminUser() {
  const [error, setError] = useState(""); // state is used to display any error
  const { currentUser, logout } = useAuth(); // referencing auth so that we can access the current user and also logout. These
  // are functionalities of firebase. We are also referencing the logout function from AuthContext file by using use Auth.
  const navigate = useNavigate(); // will be used to automatially switch pages once user logs out

  async function handleLogout() {
    setError(""); //setting error to empty string
    try {
      await logout();
      navigate("/AdminLogin"); //once user logs out, the page switches to the login page
    } catch (error) {
      //in case user cant log out, error message will be displayed
      console.log("the error is: ", { error });
      setError("Failed to log out");
    }
  }

  return (
    <div>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Using  currentUser to access the email and display name of the current user and show it*/}
          <strong> Email: </strong> {currentUser.email}
          <strong> Password </strong> {currentUser.password}
          <Link to="/AdminUpdateProfile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
export default AdminUser;
