import { useState } from "react";
import { postComment } from "../../utils/api";
import { useDispatch } from "react-redux";
import { addComment } from "../../redux/auth/feed-slice";
import { toast } from "sonner";
import { Loader, SendHorizonal } from "lucide-react";

type Props = {
  postId: string;
  setPostComments?: (post: any) => void;
};

const PostComment = ({ setPostComments, postId }: Props) => {
  const [commentValue, setCommentValue] = useState<string>("");
  const [postCommentLoading, setPostCommentLoading] = useState(false);
  const dispatch = useDispatch();
  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();
    setPostCommentLoading(true);
    await postComment(postId, commentValue)
      .then((response) => {
        dispatch(addComment({ postId: postId, comment: response.payload }));
        setCommentValue("");
        setPostCommentLoading(false);
        setPostComments &&
          setPostComments((postComments: any) => [
            ...postComments,
            response.payload,
          ]);
      })
      .catch((error) => {
        toast.error(error.message);
        setPostCommentLoading(false);
      });
  };
  return (
    <form
      onSubmit={handleCommentSubmit}
      className="flex flex-row w-full px-3 h-8 mt-1 items-center"
    >
      <input
        type="text"
        value={commentValue}
        onChange={(e: any) => setCommentValue(e.target.value)}
        placeholder="Write a comment!"
        className="border-none outline-none w-full bg-slate-200 h-full px-3 rounded-full text-slate-800"
      />
      <button
        type="submit"
        disabled={postCommentLoading || commentValue.trim().length < 1}
        className="text-slate-600 ml-1 disabled:text-slate-300"
      >
        {postCommentLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <SendHorizonal />
        )}
      </button>
    </form>
  );
};

export default PostComment;
