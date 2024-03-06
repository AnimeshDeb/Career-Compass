import largImage from "../../../images/logos/large_v1.png";

export default function NavbarWhite() {
  return (
    <nav className="bg-white">
      <div className="flex justify-between items-center mx-auto px-4">
        <a href="/" className="flex items-center">
          <img
            src={largImage}
            alt="Career Compass"
            className="max-h-24 w-auto object-contain"
          />
        </a>
        <div className="flex-grow text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
            Welcome!
          </h3>
          <p className="text-sm md:text-lg lg:text-xl text-secondary">
            Finish your profile
          </p>
        </div>
      </div>
    </nav>
  );
}
