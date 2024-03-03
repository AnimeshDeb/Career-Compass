import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchUser from "./searchUsers/searchUsers";
import largeLogo from "../../images/logos/large_v1.png";
import "./Onboard.css";

function Onboard() {
  return (
    <Container className="onboard-container" fluid>
      <a href="/">
        <img src={largeLogo} alt="medium_logo" className="onboard-logo" />
      </a>
      <SearchUser />
      <div className="onboard-buttons">
        <Button variant="primary" className="onboard-button">
          <Link to="/SeekerLogin"> Seekers</Link>
        </Button>
        <Button variant="success" className="onboard-button">
          <Link to="/CompaniesLogin"> Mentors</Link>
        </Button>
      </div>
    </Container>
  );
}

export default Onboard;
