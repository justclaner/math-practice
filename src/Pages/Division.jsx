import { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { letterGrade, numToText } from "../helper/logic";

import CorrectSound from "../assets/correct.mp3";
import IncorrectSound from "../assets/incorrect.mp3";

import HomeButton from "../Components/HomeButton";

const Division = () => {
  const [dividend, setDividend] = useState(0);
  const [divisor, setDivisor] = useState(0);
  const [quotient, setQuotient] = useState(0);
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

  const [secondsPerQuestion, setSecondsPerQuestion] = useState(3);
  const [currTimer, setCurrTimer] = useState(secondsPerQuestion);

  const [difficulty, setDifficulty] = useState(1);

  const [minDividend, setMinDividend] = useState(0);
  const [maxDividend, setMaxDividend] = useState(10);

  const [minDivisor, setMinDivisor] = useState(0);
  const [maxDivisor, setMaxDivisor] = useState(10);

  const [special, setSpecial] = useState(false);

  const correctRef = useRef(null);
  const incorrectRef = useRef(null);

  useEffect(() => {
    if (incorrect > 0) {
      //setSecondsPerQuestion(secondsPerQuestion * 0.90 - 0.1);
    }
  }, [incorrect])

  useEffect(() => {
    if (correct > 0) {
      //setSecondsPerQuestion(secondsPerQuestion * 1.01);
    }
    setMaxStreak(Math.max(maxStreak, correct));
  }, [correct])

  useEffect(() => {
    console.log(difficulty);
    switch (difficulty) {
      case 1:
        setSecondsPerQuestion(3);

        break;
      case 2:
        setSecondsPerQuestion(10);

        setMinDividend(10);
        setMaxDividend(100);

        setMinDivisor(1);
        setMaxDivisor(10);
        break;
      case 3:
        setSecondsPerQuestion(30);

        setMinDividend(100);
        setMaxDividend(1000);

        setMinDivisor(1);
        setMaxDivisor(10);
        break;
      case 4:
        setSecondsPerQuestion(45);

        setMinDividend(1000);
        setMaxDividend(10000);

        setMinDivisor(1);
        setMaxDivisor(10);
        break;
      case 5:
        setSecondsPerQuestion(100);

        setMinDividend(10000);
        setMaxDividend(100000);

        setMinDivisor(1);
        setMaxDivisor(10);
        break;
      case 6:
        setSecondsPerQuestion(80);

        setMinDividend(10000);
        setMaxDividend(100000);

        setMinDivisor(1);
        setMaxDivisor(100);
        break;
      case 7:
        setSecondsPerQuestion(80);

        setMinDividend(100);
        setMaxDividend(100000);

        setMinDivisor(1);
        setMaxDivisor(10);
        break;
    }
    setCorrect(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setMaxStreak(0);
    setIncorrect(0);
  }, [difficulty]);

  useEffect(() => {
    setCorrect(0);
    setMaxStreak(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setFeedback("");
    setIncorrect(0);
    newQuestion();
  }, [maxDividend, maxDivisor, minDividend, minDivisor]);

  useEffect(() => {
    setQuotient(dividend / divisor);
  }, [dividend, divisor]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setStopwatch((date.getTime() - startTime) / 1000);
    }, 10);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    //console.log(stopwatch);
    if (stopwatch >= currTimer) {
      outOfTime();
    }
  }, [stopwatch]);

  const outOfTime = () => {
    if (incorrectRef.current) {
      incorrectRef.current.currentTime = 0;
      incorrectRef.current.play();
    }
    console.log("timer ended");
    setTimeoutAnswer(`\\frac{${dividend}}{${divisor}}=${quotient}`);
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
    if (difficulty == 1) {
      let factor1 = Math.floor(Math.random() * 10) + 1;
      let factor2 = Math.floor(Math.random() * 10) + 1;
      a = factor1 * factor2;
      b = factor1;
    } else {
      a = Math.floor(
        Math.random() * (maxDividend - minDividend + 1) + minDividend
      );
      b = Math.floor(
        Math.random() * (maxDivisor - minDivisor + 1) + minDivisor
      );

      if (difficulty < 7) {
        a -= a % b;
      }

      // if (Math.random() >= 0.95) {
      //   let multiplier = Math.floor(Math.random() * 68) + 31;
      //   a *= multiplier;
      //   b *= multiplier;
      //   setSpecial(true);
      // } else {
      //   setSpecial(false);
      // }

    }

    setDividend(a);
    setDivisor(b);

    setCurrTimer(secondsPerQuestion);
  };

  const answerQuestion = () => {
    setTotalQuestions(totalQuestions + 1);
    if (
      (Number(answer) == quotient.toFixed(10) ||
        answer.replace(/\s+/g, " ").trim().toLowerCase() ==
          numToText(quotient).replace(/\s+/g, " ").trim()) &&
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
      setIncorrect(incorrect + 1);
      setFeedback("INCORRECT");
      setCorrect(0);
    }
    setAnswer("");
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
      <div className="text-3xl text-center">Division Practice</div>
      <div className="flex flex-row gap-3">
        <div className="text-xl">Difficulty: </div>
        <select
          name=""
          id=""
          className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
          onChange={(e) => {
            setDifficulty(Number(e.target.value));
          }}
        >
          <option value={1}>Level 1: Division Tables</option>
          <option value={2}>Level 2: 2-digit divided by 1-digit (no remainder)</option>
          <option value={3}>
            Level 3: 3-digit divided by 1-digit (no remainder)
          </option>
          <option value={4}>
            Level 4: 4-digit divided by 1-digit (no remainder)
          </option>
          <option value={5}>
            Level 5: 5-digit divided by 1-digit (no remainder)
          </option>
          <option value={6}>
            Level 6: 5-digit divided by 2-digit (no remainder)
          </option>
          <option value={7}>Level 7: Decimal Quotients</option>
        </select>
      </div>
      <div className="text-center text-6xl">
        <InlineMath math={`\\frac{${dividend}}{${divisor}}`}></InlineMath>
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
            width: `${100 + difficulty * 25}px`,
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
      {/* {secondsPerQuestion > 0.01 && <div className="text-red-700 text-5xl">Something feels a bit off today...</div>} */}
      
      {secondsPerQuestion <= 0 && <div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[128px] bold text-red-500">gg</div>
      </div> }

      {special && <div className="text-6xl text-red-600">An Extra Hard Question! (5%)</div> }

      <audio src={CorrectSound} ref={correctRef}></audio>
      <audio src={IncorrectSound} ref={incorrectRef}></audio>
    </div>
  );
};

export default Division;
