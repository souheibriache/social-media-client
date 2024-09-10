import { Loader } from "lucide-react";
import FeedPost from "./FeedPost";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchFeedFailure,
  fetchFeedSuccess,
  getFeedStart,
} from "../redux/auth/feed-slice";
import { getFeed } from "../utils/api";
import { toast } from "sonner";
import CommentsComponent from "./CommentsComponent";

type Props = {};

const Feed = ({}: Props) => {
  const { isLoading, posts } = useSelector((state: any) => state.feed);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [currentCommentsPostId, setCurrentCommentsPostId] = useState<
    string | null
  >(null);
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
    <div className="relative w-96 flex flex-col gap-2 items-center ">
      <CommentsComponent
        postId={currentCommentsPostId}
        visible={commentsVisible}
        setCommentsVisible={setCommentsVisible}
        setCurrentCommentsPostId={setCurrentCommentsPostId}
      />
      {posts && posts.length ? (
        posts.map((post: any) => (
          <FeedPost
            key={post._id}
            post={post}
            setCommentsVisible={setCommentsVisible}
            setCurrentCommentsPostId={setCurrentCommentsPostId}
          />
        ))
      ) : (
        <></>
      )}
      {isLoading ? <Loader className="animate-spin" /> : <></>}
    </div>
  );
};
export default Feed;
