import { Angry, Heart, Laugh, ThumbsDown, ThumbsUp } from "lucide-react";
import { ReactionTypes } from "../../types/reaction.type.enum";

export const getReactionIcon = (
  reactionType: ReactionTypes
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

export const reactionsIcons = (reactions: any) => {
  if (!reactions?.length) return null;

  // Calculate occurrences of each reaction type
  const reactionCounts = reactions.reduce(
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
      {sortedReactions.map((reactionType: any, index: number) => {
        const { component } = getReactionIcon(reactionType);
        return (
          <div key={index} className={`${index === 1 ? "-translate-x-2" : ""}`}>
            {component}
          </div>
        );
      })}
    </>
  );
};
