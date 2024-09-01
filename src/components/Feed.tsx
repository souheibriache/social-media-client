import { Loader } from "lucide-react";
import FeedPost from "./FeedPost";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchFeedFailure,
  fetchFeedSuccess,
  getFeedStart,
} from "../redux/auth/feed-slice";
import { getFeed } from "../utils/api";
import { toast } from "sonner";

type Props = {};

const Feed = ({}: Props) => {
  const { isLoading, error, posts } = useSelector((state: any) => state.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserFeed = async () => {
      dispatch(getFeedStart());
      await getFeed(1)
        .then((response) => {
          dispatch(fetchFeedSuccess(response?.payload?.data));
        })
        .catch((error) => {
          toast.error(error.message);
          dispatch(fetchFeedFailure(error?.message));
        });
    };
    getUserFeed();
  }, []);
  return (
    <div className="w-96 flex flex-col gap-2 mt-2 items-center">
      {posts && posts.length ? (
        posts.map((post: any) => <FeedPost key={post._id} post={post} />)
      ) : (
        <></>
      )}
      {isLoading ? <Loader className="animate-spin" /> : <></>}
    </div>
  );
};
export default Feed;
