import React from "react";

type Props = {
  _id: string;
  userName: string;
  picture: string;
};

export default function UserProfile({ _id, userName, picture }: Props) {
  return (
    <div className="bg-slate-50 rounded-md h-24 flex flex-row items-center p-3 shadow-md">
      <img
        src={picture}
        alt={userName}
        className="object-cover min-w-16 h-16 rounded-full"
      />
      <div className="flex flex-col justify-between ml-5 w-full h-full">
        <p className="text-lg font-semibold">{userName}</p>
        <div className="flex flex-row justify-between w-full gap-1">
          <button className="bg-slate-600 px-10 py-1 text-center rounded-md text-white font-semibold">
            Accept
          </button>
          <button className="bg-gray-200 px-10 py-1 text-center rounded-md text-slate-600 font-semibold">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
