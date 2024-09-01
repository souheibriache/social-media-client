import Feed from "../components/Feed";
import Invitations from "../components/Invitations";
import Post from "../components/Post";
import Search from "../components/Search";

export default function Home() {
  return (
    <div className="container flex gap-2 flex-row h-full bg-white mt-5">
      <div
        id="Invitations"
        className="bg-slate-100 rounded-md flex-1 flex justify-center max-w-96 overflow-hidden"
      >
        <Invitations />
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
