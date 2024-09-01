import { ThumbsUp, Heart, Laugh, Angry, ThumbsDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getReactionIcon } from "../utils/helper.functions";
import { ReactionTypes } from "../types/reaction.type.enum";

type PostReactionsProps = {
  postId: string;
  reactions: any[];
  currentUser: any;
  addReaction: (reaction: ReactionTypes) => void;
  removeReaction: () => void;
};

const PostReactions = ({
  reactions,
  currentUser,
  addReaction,
  removeReaction,
}: PostReactionsProps) => {
  const [currentReaction, setCurrentReaction] = useState<any>(null);
  const [currentReactionIcon, setCurrentReactionIcon] = useState<any>(null);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    const userReaction = reactions.find(
      (reaction) => reaction?.user?._id === currentUser.userId
    );
    if (userReaction) {
      setCurrentReaction(userReaction);
      const { text, color, component } = getReactionIcon(userReaction?.type);
      setCurrentReactionIcon(
        <div className="flex items-center flex-row gap-2">
          {component} <p className={`${color} font-semibold`}>{text}</p>
        </div>
      );
    } else {
      setCurrentReaction(null);
      setCurrentReactionIcon(null);
    }
  }, [reactions, currentUser.userId]);

  const handleReactionClick = (reactionType: ReactionTypes) => {
    if (currentReaction) {
      removeReaction();
    }
    addReaction(reactionType);
    setShowReactions(false);
  };

  const reactionIcons = () => {
    if (!reactions.length) return null;

    const reactionCounts = reactions.reduce(
      (acc: Record<string, number>, reaction: any) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      },
      {}
    );

    const sortedReactions = Object.keys(reactionCounts)
      .sort((a, b) => reactionCounts[b] - reactionCounts[a])
      .slice(0, 2);

    return sortedReactions.map((reactionType, index) => {
      const { component } = getReactionIcon(reactionType);
      return (
        <div key={index} className={`${index === 1 ? "-translate-x-2" : ""}`}>
          {component}
        </div>
      );
    });
  };

  return (
    <div className="relative flex flex-row justify-between w-full">
      <div
        className={`absolute bottom-6 scale-0 flex gap-2 ease duration-150 bg-white p-2 rounded-md shadow-md z-10 ${
          showReactions ? "scale-100" : ""
        }`}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
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
        onMouseEnter={() => setShowReactions(true)}
        onClick={() =>
          currentReaction ? removeReaction() : setShowReactions(true)
        }
        onMouseLeave={() => setShowReactions(false)}
      >
        <button className="flex flex-row items-center text-sm justify-center gap-1 hover:scale-110 ease duration-100 font-semibold text-slate-700">
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
    </div>
  );
};

export default PostReactions;
