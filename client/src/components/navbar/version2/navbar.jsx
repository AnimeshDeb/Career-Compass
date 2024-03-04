import largImage from "../../../images/logos/large_v1.png";

export default function NavbarWhite() {
  return (
    <nav className="bg-white py-7">
      <div className="flex justify-between items-center mx-auto px-4">
        <a href="/" className="flex items-center">
          <img src={largImage} alt="medium_logo" className="h-24" />
        </a>
        <div className="flex-grow text-center">
          <h3 className="text-4xl font-semibold text-primary">Welcome!</h3>
          <p className="text-xl text-secondary">Finish your profile</p>
        </div>
      </div>
    </nav>
  );
}
