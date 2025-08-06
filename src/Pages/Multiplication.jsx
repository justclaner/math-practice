import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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

    const [maxStreak, setMaxStreak] = useState(0);

    const millisecondsForEachQuestion = 5000;

    useEffect(() => {
        newQuestion();
    }, []);

    const getStartTime = () => {
        return startTime;
    }

    useEffect(() => {
        setMaxStreak(Math.max(maxStreak, correct));
    }, [correct])

    useEffect(() => {
        //console.log(stopwatch);
        if (stopwatch >= millisecondsForEachQuestion) {
            outOfTime();
        }
    }, [stopwatch])

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            setStopwatch(date.getTime() - startTime);
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
        setAnswer("");
        setCorrect(0);
        setIncorrect(incorrect + 1);
        setFeedback("Ran out of time!");
        newQuestion();
    };

    const newQuestion = () => {
        const date = new Date();
        setStartTime(date.getTime());

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
        <div className="text-3xl">{`${Math.max(((5000 - stopwatch) / 1000).toFixed(1), 0)}s`}</div>
        <div className="text-xl">{`Correct Streak: ${correct}`}</div>
        <div className="text-xl">{`Max Streak: ${maxStreak}`}</div>
        {incorrect > 0 && <div className="text-xl text-red-500">{`Incorrect Streak: ${incorrect}`}</div>}
        {feedback && <div className="text-xl text-red-500">{feedback}</div>}
        </div>
    );
}

export default Multiplication