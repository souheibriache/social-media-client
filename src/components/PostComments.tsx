import { Loader, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { postComment } from "../utils/api";

type PostCommentsProps = {
  postId: string;
  comments: any[];
  addComment: (comment: any) => void;
};

const PostComments = ({ postId, comments, addComment }: PostCommentsProps) => {
  const [commentValue, setCommentValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await postComment(postId, commentValue)
      .then((response) => {
        addComment(response.payload);
        setCommentValue("");
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-1">
      <hr className="w-full border-slate-300" />
      <form
        onSubmit={handleCommentSubmit}
        className="flex flex-row w-full px-3 h-8 mt-1 items-center"
      >
        <input
          type="text"
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          placeholder="Write a comment!"
          className="border-none outline-none w-full bg-slate-200 h-full px-3 rounded-full text-slate-800"
        />
        <button
          type="submit"
          disabled={loading || commentValue.trim().length < 1}
          className="text-slate-600 ml-1 disabled:text-slate-300"
        >
          {loading ? <Loader className="animate-spin" /> : <SendHorizonal />}
        </button>
      </form>
    </div>
  );
};

export default PostComments;
