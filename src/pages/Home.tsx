import Feed from "../components/Feed";
import Friends from "../components/Friends";
import Invitations from "../components/Invitations";
import Post from "../components/Post";
import Search from "../components/Search";

export default function Home() {
  return (
    <div className="container flex gap-2 flex-row h-full bg-white mt-5">
      <div
        id="Invitations"
        className="bg-slate-100 min-w-64 rounded-md flex flex-col justify-start h-full  overflow-y-auto"
      >
        <Invitations />
        <Friends />
      </div>
      <div
        id="Feed"
        className="bg-slate-100 rounded-lg flex-1 basis-64 flex flex-col items-center justify-start h-full overflow-y-auto"
      >
        <Search />
        <Post />
        <Feed />
      </div>
    </div>
  );
}
