// src/utils/getReactionIcon.ts
import { ThumbsUp, Heart, Laugh, Angry, ThumbsDown } from "lucide-react";
import React from "react";

export type ReactionIconProps = {
  color: string;
  text: string;
  component: React.ReactNode;
};

export const getReactionIcon = (reactionType: string): ReactionIconProps => {
  switch (reactionType) {
    case "like":
      return {
        color: "text-blue-600",
        component: (
          <ThumbsUp className="p-1.5 text-white bg-blue-600 rounded-full" />
        ),
        text: "Like",
      };
    case "love":
      return {
        color: "text-red-600",
        component: (
          <Heart className="p-1.5 text-white bg-red-600 rounded-full" />
        ),
        text: "Love",
      };
    case "haha":
      return {
        color: "text-yellow-600",
        component: (
          <Laugh className="p-1.5 text-white bg-yellow-600 rounded-full" />
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
          <ThumbsDown className="p-1.5 text-white bg-gray-600 rounded-full" />
        ),
        text: "Unlike",
      };
    default:
      return {
        color: "text-blue-600",
        component: (
          <ThumbsUp className="p-1.5 text-white bg-blue-600 rounded-full" />
        ),
        text: "Like",
      };
  }
};
