import { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { letterGrade, numToText, gcf, lcm } from "../logic";

import CorrectSound from "../assets/correct.mp3";
import IncorrectSound from "../assets/incorrect.mp3";

import HomeButton from "../Components/HomeButton";

const Fractions = () => {
  const [userInput, setUserInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [stopwatch, setStopwatch] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [timeoutAnswer, setTimeoutAnswer] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const [maxStreak, setMaxStreak] = useState(0);

  const [secondsPerQuestion, setSecondsPerQuestion] = useState(100);
  const [currTimer, setCurrTimer] = useState(secondsPerQuestion);

  const [mode, setMode] = useState("Simplifying");
  const [difficulty, setDifficulty] = useState(1);

  const correctRef = useRef(null);
  const incorrectRef = useRef(null);

  const [special, setSpecial] = useState(false);

  const [numerator1, setNumerator1] = useState(0);
  const [denominator1, setDenominator1] = useState(0);
  const [numerator2, setNumerator2] = useState(0);
  const [denominator2, setDenominator2] = useState(0);

  const [answer, setAnswer] = useState("");

  const [minNumerator, setMinNumerator] = useState(0);
  const [maxNumerator, setMaxNumerator] = useState(0);

  const [minDenominator, setMinDenominator] = useState(0);
  const [maxDenominator, setMaxDenominator] = useState(0);

  const [operationType, setOperationType] = useState(0);

  const [latex, setLatex] = useState("");

  useEffect(() => {
    //console.log(stopwatch);
    if (stopwatch >= currTimer) {
      outOfTime();
    }
  }, [stopwatch]);

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
    const interval = setInterval(() => {
      const date = new Date();
      setStopwatch((date.getTime() - startTime) / 1000);
    }, 10);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (mode == "Simplifying") {
        switch (difficulty) {
            case 1:
                setSecondsPerQuestion(15);
                setMinNumerator(1);
                setMaxNumerator(10);

                setMinDenominator(2);
                setMaxDenominator(9);
                break;
            case 2:
                setSecondsPerQuestion(30);

                setMinNumerator(1);
                setMaxNumerator(10);

                setMinDenominator(2);
                setMaxDenominator(9);
                break;
            case 3:
                setSecondsPerQuestion(45);

                setMinNumerator(1);
                setMaxNumerator(25);

                setMinDenominator(2);
                setMaxDenominator(9);
                break;
            case 4:
                setSecondsPerQuestion(60);

                setMinNumerator(1);
                setMaxNumerator(10000);

                setMinDenominator(2);
                setMaxDenominator(1000);
                break;
        }
    } else if (mode == 'Add/Subtract') {
        switch (difficulty) {
            case 1:
                setSecondsPerQuestion(20);

                setMinNumerator(1);
                setMaxNumerator(20);

                setMinDenominator(2);
                setMaxDenominator(9);
                
                break;
            case 2:
                setSecondsPerQuestion(30);
                
                setMinNumerator(1);
                setMaxNumerator(20);

                setMinDenominator(2);
                setMaxDenominator(9);

                break;
            case 3:
                setSecondsPerQuestion(40);

                setMinNumerator(1);
                setMaxNumerator(30);

                setMinDenominator(2);
                setMaxDenominator(20);

                break;
            case 4:
                setSecondsPerQuestion(60);

                setMinNumerator(1);
                setMaxNumerator(150);

                setMinDenominator(10);
                setMaxDenominator(99);

                break;
            case 5:
                setSecondsPerQuestion(80);

                setMinNumerator(1);
                setMaxNumerator(2000);

                setMinDenominator(100);
                setMaxDenominator(999);

                break;
        }

    } else if (mode == 'Multiply/Divide') {
        switch (difficulty) {
            case 1:
                setSecondsPerQuestion(20);

                setMinNumerator(1);
                setMaxNumerator(9);

                setMinDenominator(2);
                setMaxDenominator(9);
                
                break;
            case 2:
                setSecondsPerQuestion(60);

                setMinNumerator(2);
                setMaxNumerator(99);

                setMinDenominator(2);
                setMaxDenominator(99);
                
                break;
            case 3:
                setSecondsPerQuestion(120);

                setMinNumerator(2);
                setMaxNumerator(999);

                setMinDenominator(2);
                setMaxDenominator(999);
                
                break;
        }
        setCorrect(0);
        setTotalCorrect(0);
        setTotalQuestions(0);
        setMaxStreak(0);
        setIncorrect(0);
    }
  }, [mode, difficulty])


  useEffect(() => {
    setCorrect(0);
    setMaxStreak(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setFeedback("");
    setIncorrect(0);

    if (minNumerator > 0 && maxNumerator > 0 && minDenominator > 0 && maxDenominator > 0) {
        newQuestion();
    }
  }, [minNumerator, maxNumerator, minDenominator, maxDenominator]);

  useEffect(() => {
    setLatex(mode == "Simplifying" ? `\\frac{${numerator1}}{${denominator1}}`
            : mode == "Add/Subtract" ? `\\frac{${numerator1}}{${denominator1}}${operationType == 0 ? `+` : `-`}\\frac{${numerator2}}{${denominator2}}`
            : mode == "Multiply/Divide" ? `\\frac{${numerator1}}{${denominator1}}${operationType == 0 ? `\\cdot` : `~÷~`}\\frac{${numerator2}}{${denominator2}}`
            : ``);
  }, [numerator1, numerator2, denominator1, denominator2])

  const outOfTime = () => {
    if (incorrectRef.current) {
      incorrectRef.current.currentTime = 0;
      incorrectRef.current.play();
    }
    console.log("timer ended");
    let answerArr = answer.split("/");
    setTimeoutAnswer(`${latex}=\\frac{${answerArr[0]}}{${answerArr[1]}}`);
    setUserInput("");
    setCorrect(0);
    setTotalQuestions(totalQuestions + 1);
    setIncorrect(incorrect + 1);
    setFeedback("Ran out of time!");
    newQuestion();
  };

  const newQuestion = () => {
    const date = new Date();
    setStartTime(date.getTime());

    let operation = Math.floor(Math.random() * 2)
    setOperationType(operation);

    setUserInput("");
    //if simplifying
    if (mode == "Simplifying") {
        let n = Math.floor(Math.random() * (maxNumerator - minNumerator + 1) + minNumerator);
        let d = Math.floor(Math.random() * (maxDenominator - minDenominator + 1) + minDenominator);
        let greatestCommonFactor = gcf(n, d);

        //set the answer
        if (Number.isInteger(n / d)) {
            setAnswer(`${n / d}`);
        } else {
            setAnswer(`${n / greatestCommonFactor}/${d / greatestCommonFactor}`);
        }

        n /= greatestCommonFactor;
        d /= greatestCommonFactor;
        if (Math.random() < 0.5) {
        } else {
        }

        let multiplier = 1;

        switch (difficulty) {
            case 1:
                multiplier = Math.floor(Math.random() * (9 - 2 + 1)) + 2;
                break;
            case 2:
                multiplier = Math.floor(Math.random() * (19 - 10 + 1)) + 10;
                break;
            case 3:
                multiplier = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
                break;
            case 4:
                multiplier = Math.floor(Math.random() * (100 - 2 + 1)) + 2
                break;
        }

        n *= multiplier;
        d *= multiplier;

        setNumerator1(n);
        setDenominator1(d);


        //not using 'else' clause in case more operations are added in the future
    } else if (mode == "Add/Subtract" || mode == "Multiply/Divide") {
        //Generate the numerators and denominators
        let n1 = Math.floor(Math.random() * (maxNumerator - minNumerator + 1) + minNumerator);
        let d1 = Math.floor(Math.random() * (maxDenominator - minDenominator + 1) + minDenominator);
        let n2 = Math.floor(Math.random() * (maxNumerator - minNumerator + 1) + minNumerator);
        let d2 = Math.floor(Math.random() * (maxDenominator - minDenominator + 1) + minDenominator);
        
        //if subtraction, avoid negative answer by switching them
        if (mode == "Add/Subtract" && operation == 1) {
            if (n1 / d1 < n2 / (difficulty == 1 ? d1 : d2)) {
                n1 ^= n2;
                n2 ^= n1;
                n1 ^= n2;

                if (difficulty != 1) {
                    d1 ^= d2;
                    d2 ^= d1;
                    d1 ^= d2;
                }
            }
        }

        //Store the numerators and denominators in React State
        setNumerator1(n1);
        setDenominator1(d1);
        setNumerator2(n2);

        if (difficulty == 1 && mode == "Add/Subtract") {
            setDenominator2(d1)
        } else {
            setDenominator2(d2);
        }

        //calculate the answer
        let n3;
        let d3;
        if (mode == "Add/Subtract") {
            n3 = n1 * (difficulty == 1 ? d1 : d2);
            
            if (operation == 0) {
                n3 += n2 * d1;
            } else {
                n3 -= n2 * d1;
            }
            
            d3 = d1 * (difficulty == 1 ? d1 : d2);
        } else if (mode == "Multiply/Divide") {
            if (operation == 1) {
                n2 ^= d2;
                d2 ^= n2;
                n2 ^= d2;
            }

            n3 = n1 * n2;
            d3 = d1 * d2;
        } else {
            console.log("NO OPERATION FOUND");
        }

        //store the answer in React State
        let greatestCommonFactor = gcf(n3, d3);
        n3 /= greatestCommonFactor;
        d3 /= greatestCommonFactor;

        if (Number.isInteger(n3 / d3)) {
            setAnswer(`${n3 / d3}`);
        } else {
            setAnswer(`${n3}/${d3}`);
        }
    }

    setCurrTimer(secondsPerQuestion);
  }

  const answerQuestion = () => {
    setTotalQuestions(totalQuestions + 1);
    if (
      (userInput.trim() == answer 
        // ||
        // userInput.replace(/\s+/g, " ").trim().toLowerCase() ==
        //   numToText(answer).replace(/\s+/g, " ").trim()
        ) &&
      userInput != ""
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
    setUserInput("");
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
        <div className="text-xl">Mode: </div>
        <select
          className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
          onChange={(e) => {
            setMode(e.target.value);
            setDifficulty(1);
          }}
        >
          <option value={"Simplifying"}>Simplifying</option>
          <option value={"Add/Subtract"}>Addition/Subtraction</option>
          <option value={"Multiply/Divide"}>Multiplication/Division</option>
        </select>

          {/* Simplifying Difficulty Options */}
          {mode == "Simplifying" && 
          <div className="flex flex-row gap-3">
              <div className="text-xl">Difficulty: </div>
              <select
              className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
              onChange={(e) => {
                setDifficulty(Number(e.target.value));
              }}>
                <option value={1}>Level 1: GCF less than 10</option>
                <option value={2}>Level 2: GCF between 10 and 19 inclusive</option>
                <option value={3}>Level 3: GCF between 20 and 100 inclusive</option>
                <option value={4}>Level 4: Large Numbers and GCF at most 100</option>
              </select>
          </div>
          }

          {/* Addition/Subtraction Difficulty Options */}
          {mode == "Add/Subtract" && 
          <div className="flex flex-row gap-3">
              <div className="text-xl">Difficulty: </div>
              <select
              className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
              onChange={(e) => {
                setDifficulty(Number(e.target.value));
              }}>
                <option value={1}>Level 1: Like Denominators</option>
                <option value={2}>Level 2: Unlike Single-digit Denominators</option>
                <option value={3}>Level 3: Unlike Denominators At Most 20</option>
                <option value={4}>Level 4: Unlike Double-Digit Denominators</option>
                <option value={5}>Level 5: Unlike Triple-Digit Denominators</option>
              </select>
          </div>
          }

          {/* Multiplication/Division Difficulty Options */}
          {mode == "Multiply/Divide" && 
          <div className="flex flex-row gap-3">
              <div className="text-xl">Difficulty: </div>
              <select
              className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
              onChange={(e) => {
                setDifficulty(Number(e.target.value));
              }}>
                <option value={1}>Level 1: All Operands Single-Digit</option>
                <option value={2}>Level 2: All Operands At Most Double-Digit</option>
                <option value={3}>Level 3: All Operands At Most Triple-Digit</option>
              </select>
          </div>
          }
        
      </div>
      {/* Latex Display */}
      <div className="text-center text-6xl">
        <InlineMath math={latex}></InlineMath>
      </div>
      <div className="flex flex-row items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          className="text-3xl border-2 border-black px-2 py-1 rounded-xl"
          style={{
            width: `125px`,
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

      {secondsPerQuestion <= 0 && (
        <div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[128px] bold text-red-500">
            gg
          </div>
        </div>
      )}

      {special && (
        <div className="text-6xl text-red-600">
          An Extra Hard Question! (5%)
        </div>
      )}

      <audio src={CorrectSound} ref={correctRef}></audio>
      <audio src={IncorrectSound} ref={incorrectRef}></audio>
    </div>
  );
};

export default Fractions;
