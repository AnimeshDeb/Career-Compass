import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchUser from "./searchUsers/searchUsers";
import largeLogo from "../../images/logos/large_v1.png";
import "./Onboard.css";
import anime from "animejs";

function Onboard() {
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const searchUserRef = React.createRef();
  const translateYValue = window.innerWidth < 768 ? "-100px" : "-400px";
  const searchInputWidth = window.innerWidth < 768 ? "100%" : "500px";

  const handleSearchFocus = () => {
    if (!searchInitiated) {
      setSearchInitiated(true);
      anime({
        targets: ".search-main",
        translateY: [0, translateYValue],
        duration: 3000,
        easing: "easeOutExpo",
      });
      anime({
        targets: ".searchInput",
        width: ["600px", searchInputWidth],
        easing: "easeOutExpo",
        duration: 3000,
        complete: function () {
          setShowBackButton(true);
        },
      });
    }
  };

  const revertView = () => {
    if (searchInitiated) {
      anime({
        targets: ".search-main",
        translateY: [translateYValue, 0],
        duration: 1000,
        easing: "easeInExpo",
        complete: function () {
          setSearchInitiated(false);
          setShowBackButton(false);
          if (searchUserRef.current) {
            searchUserRef.current.resetSearch();
          }
        },
      });
      anime({
        targets: ".searchInput",
        width: ["800px", "600px"],
        easing: "easeInExpo",
        duration: 1000,
      });
    }
  };

  return (
    <Container className="onboard-container" fluid>
      <img
        src={largeLogo}
        alt="medium_logo"
        className={`onboard-logo ${searchInitiated ? "hidden" : ""}`}
      />
      <SearchUser
        showBackButton={showBackButton}
        onSearchFocus={handleSearchFocus}
        onRevertView={revertView}
        ref={searchUserRef}
      />
      <div className={`onboard-buttons ${searchInitiated ? "hidden" : ""}`}>
        <Button variant="primary" className="onboard-button">
          <Link to="/SeekerLogin"> Login </Link>
        </Button>
        <Button variant="success" className="onboard-button">
          <Link to="/CompaniesLogin"> Sign Up </Link>
        </Button>
      </div>
    </Container>
  );
}
export default Onboard;
