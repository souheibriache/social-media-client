import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

type Props = {
  id: string;
  onChange: (e: any) => void;
};

const PasswordInput = ({ id, onChange }: Props) => {
  const [passwordVisible, setpasswordVisible] = useState<boolean>(true);
  return (
    <div className="flex flex-row items-center bg-slate-100 rounded-lg justify-between pr-3 focus:outline-1">
      <input
        type={passwordVisible ? "password" : "text"}
        id={id}
        onChange={onChange}
        placeholder="password"
        className="bg-slate-100 p-3 rounded-lg border-none outline-none w-full"
      />
      {passwordVisible ? (
        <Eye
          className="cursor-pointer"
          onClick={() => setpasswordVisible(!passwordVisible)}
        />
      ) : (
        <EyeOff
          className="cursor-pointer"
          onClick={() => setpasswordVisible(!passwordVisible)}
        />
      )}
    </div>
  );
};
export default PasswordInput;
