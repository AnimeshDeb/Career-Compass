import React, { useState, useEffect } from 'react';
import "./edit_btn.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

export default function Edit_Btn({ className }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [iconSize, setIconSize] = useState("2x");

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth < 400) {
            setIconSize("2x");
        } else if (windowWidth < 769) {
            setIconSize("3x");
        } else {
            setIconSize("4x");
        }
    }, [windowWidth]);

    return (
        <button className={`edit-btn ${className}`}>
            <FontAwesomeIcon icon={faUserPen} size={iconSize} />
        </button>
    );
}

Edit_Btn.propTypes = {
    className: PropTypes.string,
};
