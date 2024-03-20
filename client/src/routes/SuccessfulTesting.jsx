import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function SuccessfulTesting() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-green-500"
        size="3x"
      />
      <h1 className="text-xl md:text-3xl font-bold text-center mt-6">
        Successfully Tested
      </h1>
      <p className="text-md md:text-lg text-center mt-4">
        Thank you for testing our website. Your feedback is invaluable to us.
      </p>
    </div>
  );
}
