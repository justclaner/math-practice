import React from "react";
import ButtonLink from "../Components/ButtonLink";

const Home = () => {
  return (
    <div className="flex flex-col items-center py-2 gap-3">
      <div className="text-5xl">Math Practice Tools</div>
      <div
        className="border-2 border-black w-[80%] h-[80vh] rounded-xl 
      flex flex-row flex-wrap gap-2 bg-red-300 p-2 justify-start"
      >
        <ButtonLink text="Multiplication" link="/multiplication" />
        <ButtonLink text="Division" link="/division" />
        <ButtonLink text="Fractions" link="/fractions" />
      </div>
    </div>
  );
};

export default Home;
