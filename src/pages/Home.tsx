import Feed from "../components/Feed";
import Friends from "../components/Friends";
import Invitations from "../components/Invitations";
import Post from "../components/Post";
import Search from "../components/Search";

export default function Home() {
  return (
    <div className="container flex gap-2 flex-row h-full bg-white mt-5 home ">
      <div
        id="Invitations"
        className="bg-slate-100 w-1/4 rounded-md flex flex-col justify-start  overflow-y-auto "
      >
        <Invitations />
        <Friends />
      </div>
      <div
        id="Feed"
        className="bg-slate-100 rounded-lg flex-1 flex flex-col items-center gap-2 py-2 justify-start overflow-y-auto"
      >
        <Search />
        <Post />
        <Feed />
      </div>
    </div>
  );
}
