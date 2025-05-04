import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";

export type LoginInput = {
  email: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>();

  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await axios.post<{ access_token: string }>(
        "/api/auth/login",
        {
          email: data.email,
          password: data.password
        }
      );

      if (res.data) {
        login(res.data.access_token);
        navigate("/");
      } else {
        alert("Username or password is wrong");
      }
    } catch (err) {
      alert("Username or password is wrong");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300 px-6 font-mono">
      <div className="max-w-lg w-full bg-white p-8 border-4 border-black rounded-none shadow-none relative">
        {isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 rounded-none border-4 border-black">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <h2 className="text-4xl font-extrabold text-black mb-8 border-b-4 border-black pb-3 uppercase tracking-wide">
          Login to Your Account
        </h2>

        <form
          className="space-y-8"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-bold text-black mb-3 tracking-wide"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className={`w-full px-4 py-3 border-4 border-black bg-yellow-100 text-black font-bold focus:outline-none ${
                errors.email ? "ring-4 ring-red-600" : ""
              }`}
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-700 text-sm font-bold mt-2 uppercase italic" id="emailError">
                Email is required.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-bold text-black mb-3 tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={`w-full px-4 py-3 border-4 border-black bg-yellow-100 text-black font-bold focus:outline-none ${
                errors.password ? "ring-4 ring-red-600" : ""
              }`}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-700 text-sm font-bold mt-2 uppercase italic" id="passwordError">
                Password is required.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-yellow-300 py-4 font-extrabold text-xl tracking-wide hover:bg-yellow-300 hover:text-black border-4 border-black transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-black font-bold">
          Don't have an account?{" "}
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="underline hover:no-underline uppercase"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
