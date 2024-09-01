import { Loader, SearchIcon, X } from "lucide-react";
import React, { useState } from "react";
import UserListItem from "./UserListItem";
import { searchUsers } from "../utils/api";

type Props = {};

const Search = ({}: Props) => {
  const [usersList, setUsersList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUsersSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const handleChange = async (e: any) => {
    setSearchInput(e.target.value);
    setIsLoading(true);
    if (e.target.value === "") {
      setUsersList([]);
      setIsLoading(false);
      return;
    }
    await searchUsers(e.target.value).then((data) => {
      setUsersList(data.payload.data);
      setIsLoading(false);
      console.log({ data });
    });
  };
  return (
    <div className="mt-3 relative rounded-md shadow-md ">
      <form onSubmit={handleUsersSearch}>
        <div
          className={`flex flex-row w-96 bg-white justify-between h-10 items-center px-3 rounded-md ${
            usersList.length || isLoading
              ? "rounded-b-none border-b-slate-400 border-b-2"
              : ""
          }`}
        >
          <input
            type="text"
            value={searchInput}
            placeholder="Search for a user"
            onChange={handleChange}
            className="w-full border-none outline-none"
          />
          {searchInput.length ? (
            <X
              onClick={() => {
                setSearchInput("");
                setUsersList([]);
              }}
            />
          ) : (
            <SearchIcon className="cursor-pointer" />
          )}
        </div>
      </form>
      {isLoading || usersList.length ? (
        <ul className="bg-white rounded-b-2xl p-3 flex flex-col gap-3 items-center absolute shadow-md w-full max-h-96 overflow-y-scroll">
          {isLoading ? (
            <Loader />
          ) : usersList.length ? (
            usersList.map((user, index) => {
              return (
                <>
                  {" "}
                  <UserListItem key={index} user={user} />
                  {index < usersList.length - 1 ? (
                    <hr className="border-slate-600 border-1 w-9/12 " />
                  ) : (
                    <></>
                  )}{" "}
                </>
              );
            })
          ) : (
            <></>
          )}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Search;
