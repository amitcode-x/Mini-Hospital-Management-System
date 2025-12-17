import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: "flex", gap: "10px" }}>
      <Link to="/">Home</Link>

      {user?.role === "PATIENT" && (
        <>
          <Link to="/patient">Dashboard</Link>
          <Link to="/book">Book Appointment</Link>
        </>
      )}

      {user?.role === "DOCTOR" && (
        <Link to="/doctor">Doctor Dashboard</Link>
      )}

      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
