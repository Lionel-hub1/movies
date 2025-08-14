import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ICONS } from "../data/constants";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const prevLocation = location.state?.prevLocation || "/";

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate(prevLocation);
    }
  }, [navigate, prevLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Simulate login process
    setTimeout(() => {
      const userData = {
        email: email,
        name: email.split('@')[0], // Simple name extraction from email
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      navigate(prevLocation);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src={ICONS.logo} alt="Movies Logo" className="w-16 h-16 mx-auto mb-2" />
          <h2 className="text-4xl font-bold text-white font-['Bebas_Neue']">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400">Sign in to access your account</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-400 bg-red-900 rounded-lg bg-opacity-30">
            {error}
          </div>
        )}

        <form
          autoComplete="off"
          className="p-8 space-y-6 bg-gray-800 rounded-xl bg-opacity-50 shadow-lg backdrop-blur-sm"
          onSubmit={handleSubmit}
          aria-label="login-form"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-white bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:text-opacity-80"
                onClick={() => alert('Reset functionality would be implemented here')}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-white bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-8 py-4 text-lg font-semibold tracking-wide text-white transition duration-300 rounded-lg bg-primary hover:bg-opacity-90 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 mr-3 animate-spin">
                    <img src={ICONS.loadingIc} alt="Loading" className="w-full h-full" />
                  </span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/explore" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="p-4 mt-6 text-sm text-center text-gray-400">
          <p>For demo purposes, you can use any email and password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
