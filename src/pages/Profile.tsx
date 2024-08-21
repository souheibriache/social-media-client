import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserById } from "../utils/api";
import { Loader } from "lucide-react";
import MyProfile from "../components/MyProfile";
import OtherUserProfile from "../components/OtherUserProfile";

const Profile = () => {
  const { userId } = useParams();
  const { accessToken } = useSelector((state: any) => state.auth);
  const { currentUser } = useSelector((state: any) => state.user);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        await getUserById(userId || "").then((response) => {
          setUserProfile(response.payload);
          setIsLoading(false);
        });
      } catch (error) {
        console.log("Error getting user :" + error);
      }
    };
    userId && getUserProfile();
  }, [userId]);
  return (
    <div className="container flex flex-col justify-center w-full items-center">
      {isLoading ? (
        <Loader />
      ) : userId === currentUser.userId ? (
        <MyProfile user={userProfile} />
      ) : (
        <OtherUserProfile user={userProfile} />
      )}
    </div>
  );
};

export default Profile;
