import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { letterGrade } from "../logic";

const Multiplication = () => {
    const [factor1, setFactor1] = useState(0);
    const [factor2, setFactor2] = useState(0);
    const [product, setProduct] = useState(0);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [stopwatch, setStopwatch] = useState(0);
    const [startTime, setStartTime] = useState((new Date()).getTime());
    const [timeoutAnswer, setTimeoutAnswer] = useState(null)
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    const [maxStreak, setMaxStreak] = useState(0);

    const [secondsPerQuestion, setSecondsPerQuestion] = useState(5);

    const [difficulty, setDifficulty] = useState(1);

    const [minFactor1, setMinFactor1] = useState(0);
    const [maxFactor1, setMaxFactor1] = useState(10);

    const [minFactor2, setMinFactor2] = useState(0);
    const [maxFactor2, setMaxFactor2] = useState(10);

    useEffect(() => {
        newQuestion();
    }, []);

    const getStartTime = () => {
        return startTime;
    }

    useEffect(() => {
        console.log(difficulty)
        switch (difficulty) {
            case 1:
                setSecondsPerQuestion(5);

                setMinFactor1(0);
                setMaxFactor1(10);

                setMinFactor2(0);
                setMaxFactor2(10);
                break;
            case 2:
                setSecondsPerQuestion(15);

                setMinFactor1(10);
                setMaxFactor1(99);

                setMinFactor2(0);
                setMaxFactor2(10);
                break;
            case 3:
                setSecondsPerQuestion(30);

                setMinFactor1(10);
                setMaxFactor1(99);

                setMinFactor2(10);
                setMaxFactor2(99);
                break;
            case 4:
                setSecondsPerQuestion(45);

                setMinFactor1(100);
                setMaxFactor1(999);

                setMinFactor2(10);
                setMaxFactor2(99);
                break;
            case 5:
                setSecondsPerQuestion(60);

                setMinFactor1(100);
                setMaxFactor1(999);

                setMinFactor2(100);
                setMaxFactor2(999);
                break;
            case 6:
                setSecondsPerQuestion(100);

                setMinFactor1(1000);
                setMaxFactor1(9999);

                setMinFactor2(1000);
                setMaxFactor2(9999);
                break;
        }
    }, [difficulty])

    useEffect(() => {
        setCorrect(0);
        setMaxStreak(0);
        setTotalCorrect(0);
        setTotalQuestions(0);
        setFeedback("");
        setIncorrect(0);
        newQuestion();
    }, [maxFactor1, maxFactor2, minFactor1, minFactor2])

    useEffect(() => {
        setMaxStreak(Math.max(maxStreak, correct));
    }, [correct])

    useEffect(() => {
        //console.log(stopwatch);
        if (stopwatch >= secondsPerQuestion) {
            outOfTime();
        }
    }, [stopwatch])

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            setStopwatch((date.getTime() - startTime) / 1000);
        }, 10);

        return () => clearInterval(interval);
    }, [startTime])

    useEffect(() => {
        console.log(feedback);
    }, [feedback]);

    useEffect(() => {
        setProduct(factor1 * factor2);
    }, [factor1, factor2]);

    const outOfTime = () => {
        console.log("timer ended");
        setTimeoutAnswer(`${factor1}\\cdot${factor2}=${product}`)
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
        let a = Math.floor(Math.random() * (maxFactor1 - minFactor1 + 1) + minFactor1);
        let b = Math.floor(Math.random() * (maxFactor2 - minFactor2 + 1) + minFactor2);

        //switch them randomly
        if (Math.random() < 0.5) {
            a ^= b;
            b ^= a;
            a ^= b;
        }
        setFactor1(a);
        setFactor2(b);
        setProduct(a * b);
    };

    const answerQuestion = () => {
        setTotalQuestions(totalQuestions + 1);
        if (answer == product && answer != "") {
            setCorrect(correct + 1);
            setTotalCorrect(totalCorrect + 1);
            setIncorrect(0);
            setFeedback("");
            newQuestion();
        } else {
            setAnswer("");
            setIncorrect(incorrect + 1);
            setFeedback("INCORRECT");
            setCorrect(0);
        }
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
        <div className="text-3xl text-center">Multiplication Practice</div>
        <div className="flex flex-row gap-3">
            <div className="text-xl">Difficulty: </div>
            <select name="" id="" className="border-2 border-black px-2 py-1 rounded-md"
            onChange={(e) => {
                setDifficulty(Number(e.target.value));
            }}
            >
                <option value={1}>1) Times Table</option>
                <option value={2}>2) 2-digit by 1-digit</option>
                <option value={3}>3) 2-digit by 2-digit</option>
                <option value={4}>4) 3-digit by 2-digit</option>
                <option value={5}>5) 3-digit by 3-digit</option>
                <option value={6}>6) 4-digit by 4-digit</option>
            </select>
        </div>
        <div className="text-center text-3xl">
            <InlineMath math={`${factor1}\\cdot${factor2}`}></InlineMath>
        </div>
        <div className="flex flex-row items-center gap-2">
            <input
                type="text"
                value={answer}
                onChange={(e) => {
                setAnswer(e.target.value);
                }}
                className="text-3xl border-2 border-black px-2 py-1 w-[100px] rounded-xl"
            />
            <button className="border-2 border-black px-2 py-1 text-3xl rounded-xl 
            select-none hover:bg-neutral-400 active:bg-neutral-300 duration-100" onClick={() => {
                answerQuestion();
            }}>Enter</button>
        </div>
        <div className="text-3xl">{`${Math.max(((secondsPerQuestion - stopwatch)).toFixed(1), 0)}s`}</div>
        <div className="text-xl">{`Correct Streak: ${correct}`}</div>
        <div className="flex flex-row items-center gap-5">
            <div className="text-xl">{`Max Streak: ${maxStreak}`}</div>
            {totalQuestions > 0 && 
            <div className="text-xl">{`
                ${totalCorrect}/${totalQuestions} 
                (${(100 * totalCorrect / totalQuestions).toFixed(2)}%)
                  ${letterGrade(totalCorrect / totalQuestions)}
                `}</div>
            }
        </div>
        {incorrect > 0 && <div className="text-xl text-red-500">{`Incorrect Streak: ${incorrect}`}</div>}
        {feedback && <div className="text-xl text-red-500">{feedback}</div>}
        {timeoutAnswer && <div className="text-6xl text-red-700"><InlineMath math={timeoutAnswer}/></div>}
        </div>
    );
}

export default Multiplication