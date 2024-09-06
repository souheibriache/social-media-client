import { reactionsIcons } from "./post/postReactions";
import { useEffect, useRef, useState } from "react";
import { Loader, X } from "lucide-react";
import defaultProfilePicture from "../assets/default-user.jpg";
import { timeAgo } from "../utils/timeago";
import PostComment from "./post/PostComment";
import { fetchPostComments, fetchPostReactions } from "../utils/api";
import { Link } from "react-router-dom";

type Props = {
  postId: string | null;
  visible: boolean;
  setCurrentCommentsPostId: (postId: string | null) => void;
  setCommentsVisible: (visibility: boolean) => void;
};

const CommentsComponent = ({
  visible,
  postId,
  setCurrentCommentsPostId,
  setCommentsVisible,
}: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postComments, setPostComments] = useState<any>([]);
  const [postReactions, setPostReactions] = useState<any>([]);
  const [postReactionIcons, setpostReactionIcons] = useState<any>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollTo({
        top: commentsEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [postComments]);

  useEffect(() => {
    if (postReactions.length)
      setpostReactionIcons(
        <>
          {reactionsIcons(postReactions)}
          <p className="w-full">{postReactions.length} Reactions</p>
        </>
      );
    else setpostReactionIcons(<div className="w-full"></div>);

    console.log({ postReactions });
  }, [postReactions]);

  useEffect(() => {
    const fetchData = async () => {
      fetchPostComments(postId as string).then((response) => {
        setPostComments(response.payload.data);
        setCommentsLoading(false);
      });

      fetchPostReactions(postId as string).then((response) => {
        setPostReactions(response.payload.reactions);
        setCommentsLoading(false);
      });
    };

    if (postId !== null) {
      fetchData();
    }
  }, [postId]);

  return postId ? (
    <>
      <div
        onClick={() => {
          setCurrentCommentsPostId(null);
          setPostComments([]);
          setPostReactions([]);
          setCommentsLoading(true);
          setCommentsVisible(false);
        }}
        className={`fixed w-screen h-screen z-40 bg-white opacity-50 top-0 left-0 ${
          visible ? "" : "hidden"
        }`}
      ></div>
      <div
        className={`fixed w-96 h-96 bg-white z-40 top-32 ${
          visible ? "flex" : "translate-y-96 hidden opacity-0"
        } duration-150 ease-in-out shadow-md rounded-md flex-col items-center p-3 gap-2`}
      >
        <div className="flex flex-row w-full justify-start items-center gap-1">
          {postReactionIcons}
          <X
            onClick={() => {
              setCurrentCommentsPostId(null);
              setPostComments([]);
              setPostReactions([]);
              setCommentsLoading(true);
              setCommentsVisible(false);
            }}
            className="p-0.5 min-w-6 bg-slate-300 rounded-full cursor-pointer"
          />
        </div>
        <hr className="w-full border-1 border-slate-400" />
        {commentsLoading ? (
          <Loader className="animate-spin h-full" />
        ) : postComments.length ? (
          <div
            className="flex flex-col gap-2 max-h-full overflow-y-auto w-full h-full"
            ref={commentsEndRef}
          >
            {postComments.map((comment: any, index: number) => (
              <>
                <div className="flex flex-row w-full gap-2" key={index}>
                  <Link to={`/profile/${comment.user._id}`}>
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={
                        comment?.user?.profile?.picture
                          ? VITE_BACKEND_URL + comment.user.profile.picture
                          : defaultProfilePicture
                      }
                    />
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex flex-row items-baseline gap-2">
                      <Link to={`/profile/${comment.user._id}`}>
                        <p className="font-semibold text-slate-800 text-lg">
                          {comment.user.userName}
                        </p>
                      </Link>
                      <p className="text-slate-500 text-sm">
                        {timeAgo.format(
                          new Date(comment?.createdAt || new Date().getTime())
                        )}
                      </p>
                    </div>

                    <p className="text-slate-800 max-w-full h-fit">
                      {comment.content}
                    </p>
                  </div>
                </div>
                {index < postComments.length - 1 ? (
                  <hr className="w-5/6 self-center border-slate-300" />
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        ) : (
          <p className="h-full">No comments yet!</p>
        )}

        <PostComment
          setPostComments={setPostComments}
          postId={postId as string}
        />
      </div>
    </>
  ) : (
    <></>
  );
};

export default CommentsComponent;
