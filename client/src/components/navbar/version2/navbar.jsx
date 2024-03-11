import largImage from "../../../images/logos/large_v1.png";
import { Link } from "react-router-dom";

export default function NavbarWhite() {
  return (
    <nav className="bg-white">
      <div className="flex justify-between items-center mx-auto px-4">
        <Link to="/" className="flex items-center">
          <img
            src={largImage}
            alt="Career Compass"
            className="max-h-20 w-auto object-contain"
          />
        </Link>
        <div className="flex-grow text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary">
            Welcome!
          </h3>
          <p className="text-sm md:text-base lg:text-lg text-secondary">
            Finish your profile
          </p>
        </div>
      </div>
    </nav>
  );
}
