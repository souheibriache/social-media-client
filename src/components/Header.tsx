import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold">Social-app</h1>
        </Link>
        <ul className="flex justify-between gap-5 items-center">
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"/about"}>
            <li>About Us</li>
          </Link>
          <Link to={"/sign-in"}>
            <li>Sign in</li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
