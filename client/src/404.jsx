import Footer from "./components/footer/footer";
import Navbar from "./components/navbar/version3/navbar";
import { Link } from "react-router-dom";
export default function Error404Page() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
        <div className="text-center p-4">
          <h2 className="text-6xl pt-2 pl-4 font-bold text-primary">
            Oops! 404 Error{" "}
          </h2>
          <h1 className="text-7xl font-bold text-primary-dark ">
            Page not Found
          </h1>
          <p className="text-2xl mb-8 mt-5 text-secondary-dark">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-md shadow transition-colors duration-200"
          >
            Take Me Home
          </Link>
        </div>
      </div>
      <Footer userType="Seeker" />
    </>
  );
}
