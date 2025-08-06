import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const App = () => {
  const [factor1, setFactor1] = useState(Math.floor(Math.random() * 11));
  const [factor2, setFactor2] = useState(Math.floor(Math.random() * 11));
  const [product, setProduct] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState("");
  const timer = 5;
  const [currTimeout, setCurrTimeout] = useState(null);

  useEffect(() => {
    newQuestion();
  }, []);

  useEffect(() => {
    console.log(feedback);
  }, [feedback]);

  useEffect(() => {
    setProduct(factor1 * factor2);
  }, [factor1, factor2]);

  const outOfTime = () => {
    console.log("timer ended");
    setAnswer("");
    setCorrect(0);
    setFeedback("Ran out of time!");
    newQuestion();
  };

  const newQuestion = () => {
    setAnswer("");
    let a = Math.floor(Math.random() * 11);
    let b = Math.floor(Math.random() * 11);
    setFactor1(a);
    setFactor2(b);
    setProduct(a * b);
  };

  return (
    <div
      className="mt-2 flex flex-col gap-2 items-center"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          if (answer == product) {
            setCorrect(correct + 1);
            setFeedback("");
            newQuestion();
          } else {
            setAnswer("");
            setFeedback("INCORRECT");
            setCorrect(0);
          }
        }
      }}
    >
      <div className="text-3xl text-center">Multiplication Practice</div>
      <div className="text-center text-3xl">
        <InlineMath math={`${factor1}\\cdot${factor2}`}></InlineMath>
      </div>
      <input
        type="text"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        className="text-3xl border-2 border-black px-2 py-1"
      />
      <div className="text-xl">{`Correct Streak: ${correct}`}</div>
      {feedback && <div className="text-xl text-red-500">{feedback}</div>}
    </div>
  );
};

export default App;
