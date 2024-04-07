export default function Footer({ userType = "Seeker" }) {
  const color = userType === "Mentor" ? "bg-primary" : "bg-secondary";

  return (
    <footer
      className={`${color} text-white flex flex-col items-center mt-0 p-2`}
    >
      <p>© 2024 Career Compass. All Rights Reserved</p>
    </footer>
  );
}
