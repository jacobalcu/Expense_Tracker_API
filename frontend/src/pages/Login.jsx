import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  // Get login func from global context
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: email,
        password: password,
      });
      console.log("Success! User logged in.");
      login(response.data["access_token"]);

      // Send user to Dashboard
      navigate("/dashboard");
    } catch (error) {
      // if FastAPI throws 400 "User already exists" error, it will land here
      console.error("Login failed:", error.response?.data?.detail);
    }
  };

  return (
    <div className="form-container">
      <h1>Login Page</h1>
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
    </div>
  );
}
