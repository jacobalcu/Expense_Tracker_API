import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/auth/signup", {
        email: email,
        password: password,
      });
      console.log("Success! User created.");

      navigate("/login");
    } catch (error) {
      // if FastAPI throws 400 "User already exists" error, it will land here
      console.error("Signup failed:", error.response?.data?.detail);
    }
  };

  return (
    <div className="form-container">
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            name="email"
            type="email"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            name="password"
            type="password"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      Have an account? <Link to="/login">Sign in here</Link>
    </div>
  );
}
