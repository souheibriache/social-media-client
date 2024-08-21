import { ArrowDown, Check, Menu, X } from "lucide-react";
import React, { useState } from "react";

type Props = {
  handleUser: (action?: "Accept" | "Reject") => void;
};

const AcceptInvitationButton = ({ handleUser }: Props) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  return (
    <div
      onClick={() => setIsButtonVisible(!isButtonVisible)}
      className="bg-slate-600 cursor-pointer text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90 min-w-24 justify-between items-center relative"
    >
      Manage <Menu />
      {isButtonVisible ? (
        <ul
          className={`absolute bg-white rounded-lg shadow-md w-full text-slate-700 flex flex-col gap-2 top-8 left-0`}
        >
          <li>
            <button
              onClick={() => handleUser("Accept")}
              className="flex flex-row gap-1 w-full justify-between hover:shadow-md rounded-md px-3 py-2"
            >
              Accept <Check />
            </button>
          </li>
          <li>
            <button
              onClick={() => handleUser("Reject")}
              className="flex flex-row gap-1 w-full justify-between hover:shadow-md rounded-md px-3 py-2"
            >
              Reject <X />
            </button>
          </li>
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AcceptInvitationButton;
