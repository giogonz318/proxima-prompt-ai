import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { authError } = useAuth();

  useEffect(() => {
    if (!authError) {
      navigate("/");
    }
  }, [authError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-xl">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <button
          onClick={() => window.location.href = "/api/auth/login"}
          className="w-full py-2 bg-black text-white rounded-md"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;