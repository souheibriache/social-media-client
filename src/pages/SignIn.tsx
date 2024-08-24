import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/auth/auth-slice";
import { signIn } from "../utils/api";
import { toast } from "sonner";
import PasswordInput from "../components/PasswordInput";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoading, error } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const data = await signIn(formData);
      if (data.error) {
        dispatch(signInFailure(data.error));
        toast.error(data.message);
        return;
      }

      const accessTokenPayload: { hasProfile: boolean } = jwtDecode(
        data.accessToken
      );

      dispatch(
        signInSuccess({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          hasProfile: accessTokenPayload.hasProfile,
        })
      );

      // After successful sign-in, navigate based on profile status
      navigate("/"); // Redirect to the home page initially
    } catch (error) {
      dispatch(signInFailure(error));
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign-Innn</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <PasswordInput id={"password"} onChange={handleChange} />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 items-center my-4">
        <p>New here?</p>{" "}
        <Link to="/sign-up">
          <span className="text-slate-700 underline">Sign-up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error || "Something went wrong!" : ""}
      </p>
    </div>
  );
}
