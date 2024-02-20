import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const buttonStyle = {
  marginBottom: "10px", // Adjust the margin as needed
  width: "200px", // Adjust the width as needed
};

function Onboard() {
  return (
    <Container style={containerStyle}>
      <Button
        variant="primary"
        style={{
          ...buttonStyle,
          backgroundColor: "#007BFF",
          fontSize: "1.5rem",
        }}
      >
       <Link to="/SeekerLogin"> Seekers</Link>
      </Button>
      <Button
        variant="success"
        style={{
          ...buttonStyle,
          backgroundColor: "#28A745",
          fontSize: "1.5rem",
        }}
      >
       <Link to="/CompaniesLogin"> Companies</Link>
      </Button>
      <Button
        variant="danger"
        style={{
          ...buttonStyle,
          backgroundColor: "#DC3545",
          fontSize: "1.5rem",
        }}
      >
        <Link to="/AdminLogin">Admins</Link>
      </Button>
    </Container>
  );
}

export default Onboard;
