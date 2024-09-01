import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Heart,
  ThumbsDown,
  Laugh,
  Angry,
  SendHorizonal,
  Loader,
} from "lucide-react";
import defaultProfilePic from "../assets/default-user.jpg";
import { useState, useRef, useEffect } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { postComment, react, removeReaction } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  addReaction,
  deleteReaction,
} from "../redux/auth/feed-slice";
import { toast } from "sonner";

TimeAgo.addDefaultLocale(en);

type Props = {
  post: any;
};

const FeedPost = ({ post }: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const likeButtonRef = useRef<HTMLButtonElement>(null);
  const reactionBarRef = useRef<HTMLDivElement>(null);
  const [commentValue, setCommentValue] = useState<string>("");
  const [currentReaction, setCurrentReaction] = useState<any>(null);
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [currentReactionIcon, setCurrentReactionIcon] = useState<any>(null);
  const [postCommentLoading, setPostCommentLoading] = useState(false);

  let hoverTimeout: NodeJS.Timeout;

  const scrollToIndex = (index: number) => {
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const childWidth = container.children[index]?.clientWidth || 0;
      container.scrollTo({
        left: childWidth * index,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < post?.images?.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleLikeHover = (duration: number) => {
    hoverTimeout = setTimeout(() => {
      setShowReactions(true);
    }, duration);
  };

  const handleLikeClick = () => {
    if (currentReaction) {
      removeReaction(post._id).then(() => {
        dispatch(
          deleteReaction({
            postId: post._id,
            reactionId: currentReaction?._id,
            userId: currentUser.userId,
          })
        );
        setCurrentReaction(null);
      });
    }
    handleMouseLeave();
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    // setTimeout(() => {
    setShowReactions(false);
    // }, 200);
  };

  const handleReactionClick = (reaction: any) => {
    react(post._id, reaction).then((response) => {
      dispatch(
        addReaction({
          postId: post._id,
          reaction: response.payload,
          userId: currentUser.userId,
        })
      );
      setCurrentReaction(null);
      setCurrentReaction(response.payload);
    });
    handleMouseLeave();
  };

  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();
    setPostCommentLoading(true);
    await postComment(post._id, commentValue)
      .then((response) => {
        dispatch(addComment({ postId: post._id, comment: response.payload }));
        setCommentValue("");
        setPostCommentLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setPostCommentLoading(false);
      });
  };

  useEffect(() => {
    if (post && post.reactions.length) {
      const reaction = post.reactions.find(
        (reaction: any) => reaction?.user?._id === currentUser?.userId
      );
      if (reaction) setCurrentReaction(reaction);
    }
  }, [post, post.reactions]);

  const reactionsIcons = () => {
    if (!post?.reactions?.length) return null;

    // Calculate occurrences of each reaction type
    const reactionCounts = post.reactions.reduce(
      (acc: Record<string, number>, reaction: any) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      },
      {}
    );

    // Sort reaction types by their frequency in descending order
    const sortedReactions = Object.keys(reactionCounts)
      .sort((a, b) => reactionCounts[b] - reactionCounts[a])
      .slice(0, 2); // Take the top two reactions

    return (
      <>
        {sortedReactions.map((reactionType, index) => {
          const { component } = getReactionIcon(reactionType);
          return (
            <div
              key={index}
              className={`${index === 1 ? "-translate-x-2" : ""}`}
            >
              {component}
            </div>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    console.log({ currentReaction });
    if (currentReaction) {
      const { text, color, component } = getReactionIcon(currentReaction?.type);
      setCurrentReactionIcon(
        <div className="flex items-center flex-row gap-2">
          {component} <p className={`${color} font-semibold`}>{text}</p>
        </div>
      );
    } else {
      setCurrentReactionIcon(null);
    }
  }, [currentReaction]);

  const timeAgo = new TimeAgo("en-US");

  return (
    <div className="bg-white rounded-md shadow-md w-full h-fit flex flex-col py-3 gap-2 overflow-hidden">
      <div className="flex flex-row w-full px-3">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={
            post?.user?.profile?.picture
              ? VITE_BACKEND_URL + post.user.profile.picture
              : defaultProfilePic
          }
          alt=""
        />
        <div className="flex flex-col justify-between ml-2 w-full">
          <p className="text-slate-800 font-semibold text-lg">
            {post?.user.userName}
          </p>
          <p className="text-slate-500 text-sm">
            {timeAgo.format(new Date(post?.createdAt))}
          </p>
        </div>
        <button className="">
          <Menu />
        </button>
      </div>
      <p className="text-slate-700 px-3">{post.content}</p>
      <div className="relative flex items-center">
        {post?.images?.length > 1 ? (
          <>
            <button
              className="absolute right-0 z-10 bg-white p-1 rounded-full shadow-md disabled:opacity-50"
              onClick={handleNextClick}
              disabled={currentIndex === post?.images?.length - 1}
            >
              <ChevronRight />
            </button>
            <button
              className="absolute left-0 z-10 bg-white p-1 rounded-full shadow-md disabled:opacity-50"
              onClick={handlePrevClick}
              disabled={currentIndex === 0}
            >
              <ChevronLeft />
            </button>

            <div className="absolute right-1 top-1 text-xs bg-slate-900 text-white px-1 py-0.5 rounded-full">
              {`${currentIndex + 1}/${post?.images?.length}`}
            </div>
          </>
        ) : null}
        <div
          ref={imageContainerRef}
          className="flex flex-row w-full overflow-x-hidden"
        >
          {post?.images.map((image: string, index: number) => (
            <div
              key={index}
              className="relative w-full h-64 flex-shrink-0 overflow-hidden"
            >
              <img
                src={VITE_BACKEND_URL + image}
                alt={`Blurred background ${index}`}
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
              />
              <img
                src={VITE_BACKEND_URL + image}
                alt={`Image ${index}`}
                className="relative w-auto h-full mx-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row w-full gap-5 px-3">
        {post?.reactions?.length ? (
          <p className="flex flex-row items-center gap-1">
            {reactionsIcons()} {post.reactions.length} reactions
          </p>
        ) : null}
        {post?.comments?.length ? <p>{post.comments.length} comments</p> : null}
      </div>
      <div className="flex flex-col gap-1">
        <hr className="w-full border-slate-300" />
        <div className="relative flex flex-row justify-between w-full">
          <div
            className={`absolute bottom-6 scale-0 flex gap-2 ease duration-150 bg-white p-2 rounded-md shadow-md z-10 ${
              showReactions ? "scale-100" : ""
            }`}
            ref={reactionBarRef}
            onMouseEnter={() => handleLikeHover(0)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleReactionClick("like")}
              className="hover:animate-bounce hover:scale-125  ease duration-100"
            >
              <ThumbsUp className="text-blue-500" />
            </button>
            <button
              onClick={() => handleReactionClick("love")}
              className="hover:animate-bounce hover:scale-125  ease duration-100"
            >
              <Heart className="text-red-500" />
            </button>
            <button
              onClick={() => handleReactionClick("haha")}
              className="hover:animate-bounce hover:scale-125  ease duration-100"
            >
              <Laugh className="text-yellow-500" />
            </button>
            <button
              onClick={() => handleReactionClick("angry")}
              className="hover:animate-bounce hover:scale-125  ease duration-100"
            >
              <Angry className="text-orange-500" />
            </button>
            <button
              onClick={() => handleReactionClick("unlike")}
              className="hover:animate-bounce hover:scale-125  ease duration-100"
            >
              <ThumbsDown className="text-gray-500" />
            </button>
          </div>

          <div
            className="relative w-full flex justify-center"
            onMouseEnter={() => handleLikeHover(500)}
            onClick={handleLikeClick}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={likeButtonRef}
              className="flex flex-row items-center text-sm justify-center gap-1 hover:scale-110 ease duration-100 font-semibold text-slate-700"
            >
              {currentReactionIcon ? (
                currentReactionIcon
              ) : (
                <>
                  Like
                  <ThumbsUp className="p-1" />
                </>
              )}
            </button>
          </div>

          <button className="flex flex-row w-full items-center text-sm justify-center gap-1 hover:scale-110 ease duration-100 font-semibold text-slate-700">
            Comment
            <MessageCircle className="p-1" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <hr className="w-full border-slate-300" />
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
      </div>
    </div>
  );
};

export default FeedPost;

const getReactionIcon = (
  reactionType: string
): { color: string; text: string; component: any } => {
  switch (reactionType) {
    case "like":
      return {
        color: "text-blue-600",
        component: (
          <ThumbsUp className=" p-1.5 text-white bg-blue-600 rounded-full" />
        ),
        text: "Like",
      };

    case "love":
      return {
        color: "text-red-600",
        component: (
          <Heart className=" p-1.5 text-white bg-red-600 rounded-full" />
        ),
        text: "Love",
      };

    case "haha":
      return {
        color: "text-yellow-600",
        component: (
          <Laugh className=" p-1.5 text-white bg-yellow-600 rounded-full" />
        ),
        text: "Haha",
      };
    case "angry":
      return {
        color: "text-orange-600",
        component: (
          <Angry className="p-1.5 text-white bg-orange-600 rounded-full" />
        ),
        text: "Grrr",
      };
    case "unlike":
      return {
        color: "text-gray-600",
        component: (
          <ThumbsDown className=" p-1.5 text-white bg-gray-600 rounded-full" />
        ),
        text: "Unlike",
      };
    default:
      return {
        color: "text-blue-600",
        component: (
          <ThumbsUp className=" p-1.5 text-white bg-blue-600 rounded-full" />
        ),
        text: "Like",
      };
  }
};
