import React, { useEffect, useRef, useState } from "react";
import defaultPicture from "../assets/default-user.jpg";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserSuccess } from "../redux/auth/user-slice";
import { completeSignup } from "../utils/api";
import { signInSuccess } from "../redux/auth/auth-slice";

export default function CompleteSignUp() {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "Male",
  });

  const [currentPicture, setCurrentPicture] = useState(defaultPicture);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, refreshToken, hasProfile } = useSelector(
    (state: any) => state.auth
  );

  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate("/sign-in");
    if (hasProfile) navigate("/");
  }, [accessToken, hasProfile, navigate]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentPicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataWithImage = new FormData();
    formDataWithImage.append("dateOfBirth", formData.dateOfBirth);
    formDataWithImage.append("gender", formData.gender);

    if (imageRef.current?.files?.[0]) {
      formDataWithImage.append("picture", imageRef.current.files[0]);
    }

    try {
      const data = await completeSignup(formDataWithImage);

      setIsLoading(false);
      if (data.error) {
        setError(true);
        toast.error(data.error);
      } else {
        dispatch(fetchUserSuccess({ ...currentUser, ...data.payload }));
        dispatch(
          signInSuccess({
            accessToken,
            refreshToken,
            hasProfile: true,
          })
        );

        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      toast.error("An error occurred while completing the profile");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Complete Sign-up
      </h1>
      <div className="w-fit m-auto relative mb-5">
        <img
          className="h-32 w-32 rounded-full object-cover"
          src={currentPicture}
          alt="Profile"
        />
        <label
          htmlFor="profilePicture"
          className="absolute top-2 right-2 text-white font-semibold p-1 bg-gray-400 rounded-full cursor-pointer"
        >
          <Camera />
        </label>
        <input
          type="file"
          id="profilePicture"
          ref={imageRef}
          className="hidden"
          onChange={handlePictureChange}
        />
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="date"
          placeholder="Date of Birth"
          id="dateOfBirth"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <select
          id="gender"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          required
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
