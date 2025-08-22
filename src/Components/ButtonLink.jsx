import React from "react";
import { useNavigate } from "react-router-dom";

const ButtonLink = ({ text, link }) => {
  const navigate = useNavigate();
  return (
    <button
      className="w-fit h-[50px] text-xl px-2 py-1 rounded-xl 
    shadow-md bg-white hover:bg-neutral-300 active:bg-neutral-200 duration-100"
      onClick={(e) => {
        navigate(link);
      }}
    >
      {text}
    </button>
  );
};

export default ButtonLink;
