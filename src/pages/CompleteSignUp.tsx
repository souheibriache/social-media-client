import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserSuccess } from "../redux/auth/user-slice";
import { completeSignup, refreshAccessToken } from "../utils/api";
import { signInSuccess } from "../redux/auth/auth-slice";
import { jwtDecode } from "jwt-decode"; // Correcting the import
import { toast } from "sonner";

export default function CompleteSignUp() {
  console.log("Rendering CompleteSignUp");
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "Male",
  });

  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, refreshToken } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate("/sign-in");
  }, [accessToken, navigate]); // Add navigate to dependencies

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await completeSignup(formData); // Use the completeSignup method

      setIsLoading(false);
      if (data.error) {
        setError(true);
        toast.error(data.error);
      } else {
        dispatch(fetchUserSuccess(data.payload));

        dispatch(
          signInSuccess({
            accessToken,
            refreshToken,
            hasProfile: true,
          })
        );

        navigate("/"); // Redirect to home after profile completion
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Complete Sign-up
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="date"
          placeholder="Date of Birth"
          id="dateOfBirth"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <select
          id="gender"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
    </div>
  );
}
