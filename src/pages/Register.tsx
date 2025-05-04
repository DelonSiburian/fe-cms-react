import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>();
  const handleRegister = async (data: RegisterInput) => {
    try {
      await axios.post("/api/auth/register", {
        email: data.email,
        username: data.username,
        password: data.password
      });
      alert("User successfully registered");
      navigate("/login");
    } catch (err) {
      alert("Username or email already registered");
    }
  };
  const { mutate } = useMutation({ mutationFn: handleRegister });

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300 px-6 font-mono">
      <div className="max-w-lg w-full bg-white p-8 border-4 border-black rounded-none shadow-none">
        <h2 className="text-4xl font-extrabold text-black mb-8 border-b-4 border-black pb-3 uppercase tracking-wide">
          Create an Account
        </h2>

        <form
          className="space-y-8"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-bold text-black mb-3 tracking-wide"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className={`w-full px-4 py-3 border-4 border-black bg-yellow-100 text-black font-bold focus:outline-none ${
                errors.username ? "ring-4 ring-red-600" : ""
              }`}
              placeholder="yourusername"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-700 text-sm font-bold mt-2 uppercase italic">
                Username is required.
              </p>
            )}
          </div>

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
              <p className="text-red-700 text-sm font-bold mt-2 uppercase italic">
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
              <p className="text-red-700 text-sm font-bold mt-2 uppercase italic">
                Password is required.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-yellow-300 py-4 font-extrabold text-xl tracking-wide hover:bg-yellow-300 hover:text-black border-4 border-black transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-8 text-center text-black font-bold">
          Already have an account?{" "}
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="underline hover:no-underline uppercase"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
