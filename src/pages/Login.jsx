import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (localStorage.getItem("user")) {
    navigate(location.state.prevLocation);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: email,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setEmail("");
    setPassword("");
    navigate(location.state.prevLocation);
  };

  return (
    <div className="w-full flex justify-center">
      <form
        autoComplete="off"
        className="w-full max-w-[600px] p-10 text-white  bg-background  border-2 border-primary border-opacity-20"
        onSubmit={handleSubmit}
        aria-label="login-form"
      >
        <h2 className="mb-10 text-3xl font-bold text-center">Login</h2>
        <div className="flex flex-col items-start mb-5 gap-y-3">
          <label htmlFor="email" className="text-sm font-medium cursor-pointer">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-transparent border border-gray-200 outline-none"
            placeholder="Enter your email address..."
          />
        </div>
        <div className="flex flex-col items-start mb-5 gap-y-3">
          <label
            htmlFor="password"
            className="text-sm font-medium cursor-pointer"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-transparent border border-gray-200 outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-primary bg-opacity-20 h-[60px]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
