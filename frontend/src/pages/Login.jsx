import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/login",
        formData
      );
      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );
      localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

 return (
  <div className="login-container">
    <div className="login-card">

      <h1 className="login-title">
        Expense Tracker
      </h1>

     <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  className="login-input"
/>

<input
  type="password"
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  className="login-input"
/>

      <button
        onClick={handleLogin}
        className="login-btn"
      >
        Login
      </button>

      <div className="register-link">
        <Link to="/register">
          Register Here
        </Link>
      </div>

    </div>
  </div>
);
}

export default Login;