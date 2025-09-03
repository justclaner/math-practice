import { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { letterGrade, numToText } from "../logic";

import CorrectSound from "../assets/correct.mp3";
import IncorrectSound from "../assets/incorrect.mp3";

import HomeButton from "../Components/HomeButton";

const Multiplication = () => {
  const [factor1, setFactor1] = useState(0);
  const [factor2, setFactor2] = useState(0);
  const [product, setProduct] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [stopwatch, setStopwatch] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [timeoutAnswer, setTimeoutAnswer] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const [maxStreak, setMaxStreak] = useState(0);

  const [secondsPerQuestion, setSecondsPerQuestion] = useState(5);
  const [currTimer, setCurrTimer] = useState(secondsPerQuestion);

  const [difficulty, setDifficulty] = useState(1);

  const [minFactor1, setMinFactor1] = useState(0);
  const [maxFactor1, setMaxFactor1] = useState(10);

  const [minFactor2, setMinFactor2] = useState(0);
  const [maxFactor2, setMaxFactor2] = useState(10);

  const [started, setStarted] = useState(false);

  const correctRef = useRef(null);
  const incorrectRef = useRef(null);

  const [isRandomOrder, setIsRandomOrder] = useState(true);

  const [constant, setConstant] = useState(0);

  useEffect(() => {
    setStarted(true);
    newQuestion();
  }, []);

  useEffect(() => {
    if (incorrect > 0) {
      setSecondsPerQuestion(secondsPerQuestion * 0.9 - 0.1);
    }
  }, [incorrect])

  useEffect(() => {
    if (correct > 0) {
      setSecondsPerQuestion(secondsPerQuestion * 1.002);
    }
    setMaxStreak(Math.max(maxStreak, correct));
  }, [correct])

  useEffect(() => {
    console.log(isRandomOrder);
  }, [isRandomOrder]);

  const getStartTime = () => {
    return startTime;
  };

  useEffect(() => {
    console.log(difficulty);
    switch (difficulty) {
      case 1:
        setSecondsPerQuestion(3);

        setMinFactor1(0);
        setMaxFactor1(10);

        setMinFactor2(0);
        setMaxFactor2(10);
        break;
      case 2:
        setSecondsPerQuestion(60);

        setMinFactor1(10);
        setMaxFactor1(99);

        setMinFactor2(0);
        setMaxFactor2(10);
        break;
      case 3:
        setSecondsPerQuestion(80);

        setMinFactor1(100);
        setMaxFactor1(999);

        setMinFactor2(0);
        setMaxFactor2(10);
        break;
      case 4:
        setSecondsPerQuestion(100);

        setMinFactor1(10);
        setMaxFactor1(99);

        setMinFactor2(10);
        setMaxFactor2(99);
        break;
      case 5:
        setSecondsPerQuestion(80);

        setMinFactor1(100);
        setMaxFactor1(999);

        setMinFactor2(10);
        setMaxFactor2(99);
        break;
      case 6:
        setSecondsPerQuestion(80);

        setMinFactor1(100);
        setMaxFactor1(999);

        setMinFactor2(100);
        setMaxFactor2(999);
        break;
      case 7:
        setSecondsPerQuestion(100);

        setMinFactor1(1000);
        setMaxFactor1(9999);

        setMinFactor2(1000);
        setMaxFactor2(9999);
        break;
      case 8:
        setSecondsPerQuestion(450);

        setMinFactor1(100000000);
        setMaxFactor1(999999999);

        setMinFactor2(100000000);
        setMaxFactor2(999999999);
        break;
      case 9:
        setSecondsPerQuestion(5);
    }
    setCorrect(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setMaxStreak(0);
    setIncorrect(0);
    if (started) {
      setTimeoutAnswer(`${factor1}\\cdot${factor2}=${product}`);
    }
    newQuestion();
    setStarted(true);
  }, [difficulty, constant, isRandomOrder]);

  useEffect(() => {
    // if (started) {
    //   setTimeoutAnswer(`${factor1}\\cdot${factor2}=${product}`);
    // }
    setCorrect(0);
    setMaxStreak(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setFeedback("");
    setIncorrect(0);
    newQuestion();
  }, [maxFactor1, maxFactor2, minFactor1, minFactor2]);

  useEffect(() => {
    //console.log(stopwatch);
    if (stopwatch >= currTimer) {
      outOfTime();
    }
  }, [stopwatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setStopwatch((date.getTime() - startTime) / 1000);
    }, 10);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    console.log(feedback);
  }, [feedback]);

  useEffect(() => {
    setProduct(factor1 * factor2);
  }, [factor1, factor2]);

  const outOfTime = () => {
    if (incorrectRef.current) {
      incorrectRef.current.currentTime = 0;
      incorrectRef.current.play();
    }
    console.log("timer ended");
    setTimeoutAnswer(`${factor1}\\cdot${factor2}=${product}`);
    setAnswer("");
    setCorrect(0);
    setTotalQuestions(totalQuestions + 1);
    setIncorrect(incorrect + 1);
    setFeedback("Ran out of time!");
    newQuestion();
  };

  const newQuestion = () => {
    const date = new Date();
    setStartTime(date.getTime());

    setAnswer("");
    let a;
    let b;
    if (difficulty == 9) {
      //3, 5, 6, 7, 8, 9
      let arr1 = [3, 4, 5, 6];
      let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      a = constant;
      //a = arr1[Math.floor(Math.random() * arr1.length)];
      //a = Math.random() < 0.5 ? 3 : 4;
      b = arr[Math.floor(Math.random() * arr.length)];
    } else {
      a = Math.floor(
        Math.random() * (maxFactor1 - minFactor1 + 1) + minFactor1
      );
      b = Math.floor(
        Math.random() * (maxFactor2 - minFactor2 + 1) + minFactor2
      );
    }

    //switch them randomly
    if (Math.random() < 0.5 && isRandomOrder) {
      a ^= b;
      b ^= a;
      a ^= b;
    }

    setFactor1(a);
    setFactor2(b);
    setProduct(a * b);

    setCurrTimer(secondsPerQuestion);
  };

  const answerQuestion = () => {
    setTotalQuestions(totalQuestions + 1);
    if (
      (answer == product ||
        answer.replace(/\s+/g, " ").trim().toLowerCase() ==
          numToText(product).replace(/\s+/g, " ").trim()) &&
      answer != ""
    ) {
      if (correctRef.current) {
        correctRef.current.currentTime = 0;
        correctRef.current.play();
      }
      setCorrect(correct + 1);
      setTotalCorrect(totalCorrect + 1);
      setIncorrect(0);
      setFeedback("");
      newQuestion();
    } else {
      if (incorrectRef.current) {
        incorrectRef.current.currentTime = 0;
        incorrectRef.current.play();
      }
      setAnswer("");
      setIncorrect(incorrect + 1);
      setFeedback("INCORRECT");
      setCorrect(0);
    }
  };

  return (
    <div
      className="mt-2 flex flex-col gap-2 items-center"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          answerQuestion();
        }
      }}
    >
      <HomeButton />
      <div className="text-3xl text-center">Multiplication Practice</div>
      <div className="flex flex-row gap-3">
        <div className="text-xl">Difficulty: </div>
        <select
          name=""
          id=""
          className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md"
          onChange={(e) => {
            setDifficulty(Number(e.target.value));
          }}
        >
          <option value={1}>Level 1: Times Tables</option>
          <option value={2}>Level 2: 2-digit by 1-digit</option>
          <option value={3}>Level 3: 3-digit by 1-digit</option>
          <option value={4}>Level 4: 2-digit by 2-digit</option>
          <option value={5}>Level 5: 3-digit by 2-digit</option>
          <option value={6}>Level 6: 3-digit by 3-digit</option>
          <option value={7}>Level 7: 4-digit by 4-digit</option>
          <option value={8}>Level 8: 9-digit by 9-digit</option>
          <option value={9}>Level 9: Custom</option>
        </select>
        {difficulty == 9 && (
          <select
            name=""
            id=""
            className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md"
            onChange={(e) => {
              setConstant(Number(e.target.value));
            }}
          >
            <option value={0}>Practice 0's</option>
            <option value={1}>Practice 1's</option>
            <option value={2}>Practice 2's</option>
            <option value={3}>Practice 3's</option>
            <option value={4}>Practice 4's</option>
            <option value={5}>Practice 5's</option>
            <option value={6}>Practice 6's</option>
            <option value={7}>Practice 7's</option>
            <option value={8}>Practice 8's</option>
            <option value={9}>Practice 9's</option>
            <option value={10}>Practice 10's</option>
          </select>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <input
          type="checkbox"
          name=""
          id=""
          checked={isRandomOrder}
          onChange={(e) => {
            setIsRandomOrder(e.target.checked);
          }}
        />
        <label htmlFor="" className="text-xl">
          Random Factor Order?
        </label>
      </div>
      <div className="text-center text-6xl">
        <InlineMath math={`${factor1}\\cdot${factor2}`}></InlineMath>
      </div>
      <div className="flex flex-row items-center gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            //setAnswer(e.target.value.replace(/\s+/g, " ").trim());
          }}
          className="text-3xl border-2 border-black px-2 py-1 rounded-xl"
          style={{
            width: difficulty == 9 ? `125px` : `${100 + difficulty * 25}px`,
          }}
        />
        <button
          className="border-2 border-black px-2 py-1 text-3xl rounded-xl 
            select-none hover:bg-neutral-400 active:bg-neutral-300 duration-100"
          onClick={() => {
            answerQuestion();
          }}
        >
          Enter
        </button>
      </div>
      {/* Timer */}
      <div className="text-3xl">{`${Math.max(
        (currTimer - stopwatch).toFixed(1),
        0
      )}s`}</div>
      <div className="text-xl">{`Correct Streak: ${correct}`}</div>
      <div className="flex flex-row items-center gap-5">
        <div className="text-xl">{`Max Streak: ${maxStreak}`}</div>
        {totalQuestions > 0 && (
          <div className="text-xl">{`
                ${totalCorrect}/${totalQuestions} 
                (${((100 * totalCorrect) / totalQuestions).toFixed(2)}%)
                  ${letterGrade(totalCorrect / totalQuestions)}
                `}</div>
        )}
      </div>
      {incorrect > 0 && (
        <div className="text-xl text-red-500">{`Incorrect Streak: ${incorrect}`}</div>
      )}
      {feedback && <div className="text-xl text-red-500">{feedback}</div>}
      {timeoutAnswer && (
        <div
          className="text-red-700 text-center"
          style={{ fontSize: `${difficulty < 7 ? 60 : 32}px` }}
        >
          <InlineMath math={timeoutAnswer} />
        </div>
      )}

      {secondsPerQuestion <= 0 && <div>
        <div className="text-3xl text-red-500">>:(</div>
      </div> }

      <audio src={CorrectSound} ref={correctRef}></audio>
      <audio src={IncorrectSound} ref={incorrectRef}></audio>
    </div>
  );
};

export default Multiplication;
