import React, { useEffect, useRef, useState } from "react";
import defaultPicture from "../assets/default-user.jpg";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import fetchWithAuth from "../utils/fetchWrapper";

type Props = {
  user: any;
};

const MyProfile = ({ user }: Props) => {
  const [userInformation, setUserInformation] = useState(user);
  const [currentPicture, setCurrentPicture] = useState("");

  useEffect(() => {
    setCurrentPicture(
      user.profile?.picture
        ? `http://localhost:3000${user.profile.picture}`
        : ""
    );
  }, [user]);

  const [hasChanges, setHasChanges] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setHasChanges(true);
    if (id === "userName") {
      setUserInformation((userInformation: any) => ({
        ...userInformation,
        [id]: value,
      }));
    } else {
      setUserInformation((userInformation: any) => ({
        ...userInformation,
        profile: {
          ...userInformation.profile,
          [id]: value,
        },
      }));
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentPicture(e.target?.result as string);
        setUserInformation((userInformation: any) => ({
          ...userInformation,
          profile: {
            ...userInformation.profile,
            picture: e.target?.result,
          },
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userInformation.userName);
    formData.append("dateOfBirth", userInformation.profile?.dateOfBirth || "");
    formData.append("gender", userInformation.profile?.gender || "");

    if (imageRef.current?.files?.[0]) {
      formData.append("picture", imageRef.current.files[0]);
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const res = await fetchWithAuth("/api/profile", {
        method: "PUT",
        headers: {
          // Note: You don't need to add Authorization here as fetchWithAuth handles it
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setHasChanges(false);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile");
    }
  };

  return (
    <div className="container flex flex-col items-center mt-2">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="relative">
        <img
          className="h-32 w-32 rounded-full object-cover"
          src={currentPicture.length ? currentPicture : defaultPicture} // This should now reflect the updated image
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 mt-10 w-1/2 items-center"
      >
        <input
          className="h-10 bg-slate-200 w-full px-5 rounded-md"
          onChange={handleChange}
          id="userName"
          type="text"
          value={userInformation.userName}
        />
        <input
          className="h-10 bg-slate-200 w-full px-5 rounded-md opacity-80"
          onChange={handleChange}
          id="email"
          type="text"
          value={userInformation.email}
          disabled // Disable the email field as it's not editable
        />
        <input
          className="h-10 bg-slate-200 w-full px-5 rounded-md"
          onChange={handleChange}
          id="dateOfBirth"
          type="date"
          value={userInformation.profile?.dateOfBirth?.slice(0, 10)}
        />
        <select
          className="h-10 bg-slate-200 w-full px-5 rounded-md"
          onChange={handleChange}
          id="gender"
          value={userInformation.profile?.gender || ""}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          className="h-10 bg-slate-600 font-semibold text-white w-full px-5 rounded-md disabled:opacity-90"
          disabled={!hasChanges} // Button is disabled if no changes have been made
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
