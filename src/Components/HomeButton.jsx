import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <div
      className="absolute right-0 top-0 m-2 text-3xl hover:text-blue-300 active:text-blue-200 duration-100"
      onClick={(e) => {
        navigate("/");
      }}
    >
      <FaHome />
    </div>
  );
};

export default HomeButton;
