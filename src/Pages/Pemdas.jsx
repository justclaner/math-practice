import {useState, useEffect, useRef} from 'react'
import HomeButton from '../Components/HomeButton';
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { evaluateUserInput } from '../helper/parser';

import CorrectSound from "../assets/correct.mp3";
import IncorrectSound from "../assets/incorrect.mp3";

import { generatePEMDASProblem } from '../helper/pemdas';

import { letterGrade } from "../helper/logic";

const SafeInlineMath = ({ math }) => {
  try {
    // math must be string
    return <InlineMath math={math} />;
  } catch (e) {
    console.warn("KaTeX render failed:", e);
    return null; // hide output instead of crashing
  }
};

const Pemdas = () => {
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

    const [secondsPerQuestion, setSecondsPerQuestion] = useState(3);
    const [currTimer, setCurrTimer] = useState(secondsPerQuestion);


    const [difficulty, setDifficulty] = useState(1);
    const [maxAbsAns, setMaxAbsAns] = useState(20);
    const [operations, setOperations] = useState([]);
    const [operationCount, setOperationCount] = useState(5);

    const correctRef = useRef(null);
    const incorrectRef = useRef(null);

    const [answer, setAnswer] = useState("");
    const [latex, setLatex] = useState("\\frac{2}{3}");

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
        switch (difficulty) {
            case 1:
                setSecondsPerQuestion(30);
                setOperations(['+','-','*','/']);
                setOperationCount(5);
                setMaxAbsAns(40);
                break;
            case 2:
                setSecondsPerQuestion(45);
                setOperations([
                    '+','-','*','/','^',
                    '+','-','*','/','^',
                    'NEG'
                ]);
                setOperationCount(5);
                setMaxAbsAns(50);

                break;
            case 3:
                setSecondsPerQuestion(60);
                setOperations([
                    '+','-','*','/', '^', '!',
                    '+','-','*','/', '^', '!',
                    'NEG'
                ]);
                setOperationCount(6);
                setMaxAbsAns(100);
                break;
        }

        setCorrect(0);
        setTotalCorrect(0);
        setTotalQuestions(0);
        setMaxStreak(0);
        setIncorrect(0);
        newQuestion();
    }, [difficulty])

    useEffect(() => {
        newQuestion();
    }, [maxAbsAns, operations, operationCount])


    const outOfTime = () => {
        if (incorrectRef.current) {
            incorrectRef.current.currentTime = 0;
            incorrectRef.current.play();
        }

        setTimeoutAnswer(`${latex}=${answer}`);
        setUserInput("");
        setCorrect(0);
        setTotalQuestions(totalQuestions + 1);
        setIncorrect(incorrect + 1);
        setFeedback("Ran out of time!");
        newQuestion();
    }

    const newQuestion = () => {
        const date = new Date();
        setStartTime(date.getTime());

        setUserInput("");

        const problem = generatePEMDASProblem(operations, operationCount, maxAbsAns);
        console.log(problem[0]);
        console.log(problem[1]);
        setAnswer(Number(problem[0]));
        setLatex(problem[1]);

        setCurrTimer(secondsPerQuestion);
    }

    const answerQuestion = () => {
        setTotalQuestions(totalQuestions + 1);

        try {
            const userAnswer = Number(userInput);
            if (isNaN(userAnswer) || Number(userAnswer).toFixed(2) != answer.toFixed(2)) {
                if (incorrectRef.current) {
                    incorrectRef.current.currentTime = 0;
                    incorrectRef.current.play();
                }
                setIncorrect(incorrect + 1);
                setFeedback("INCORRECT");
                setCorrect(0);
            } else {
                if (correctRef.current) {
                    correctRef.current.currentTime = 0;
                    correctRef.current.play();
                }
                setCorrect(correct + 1);
                setTotalCorrect(totalCorrect + 1);
                setIncorrect(0);
                setFeedback("");
                newQuestion();
            }
        } catch (e) {
            console.log("Input contained illegal characters!");
            if (incorrectRef.current) {
                incorrectRef.current.currentTime = 0;
                incorrectRef.current.play();
            }
            setIncorrect(incorrect + 1);
            setFeedback("INCORRECT");
            setCorrect(0);
        }
        setUserInput("");
    }
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
        <div className="text-3xl text-center">PEMDAS Practice</div>
        <div className="flex flex-row gap-3">
            <div className="text-xl">Difficulty: </div>
            <select
            className="border-2 border-black px-2 pb-1 pt-0.5 rounded-md w-fit"
            onChange={(e) => {
                setDifficulty(Number(e.target.value));
            }}
            >
            <option value={1}>Level 1: Add/Sub/Mult/Div</option>
            <option value={2}>Level 2: Previous + Exponents</option>
            <option value={3}>Level 3: Previous + Factorials</option>
            </select>
        </div>
        <h1 className="text-5xl text-center my-4"
        style={{visibility: (latex != null && typeof latex === "string") ? `visible` : `hidden`}}>
            <SafeInlineMath math={latex} />
        </h1>

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

        <audio src={CorrectSound} ref={correctRef}></audio>
        <audio src={IncorrectSound} ref={incorrectRef}></audio>
    </div>
  )
}

export default Pemdas