import { Routes, Route } from "react-router-dom";
import Multiplication from "./Pages/Multiplication.jsx";
import Division from "./Pages/Division.jsx";
import Fractions from "./Pages/Fractions.jsx";
import Home from "./Pages/Home.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/multiplication" element={<Multiplication />} />
      <Route path="/division" element={<Division />} />
      <Route path="/fractions" element={<Fractions />} />
    </Routes>
  );
};

export default App;
