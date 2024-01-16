import medImage from "../../images/logos/large_v2.png";
import "./navbar.css"

export default function Navbar() {
    return (
        <div className="navbar">
            <a href="/"><img src={medImage} alt="medium_logo" className="navbar-image"/></a>
        </div>
    );
}