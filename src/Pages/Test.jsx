import {useState, useEffect} from 'react'
import { tokenize, shuntingYard, evaluateRPN, rpnToLatex } from '../helper/parser'
import { generatePEMDASProblem } from '../helper/pemdas';
import "katex/dist/katex.min.css";
import katex from "katex";
import { InlineMath, BlockMath } from "react-katex";

const SafeInlineMath = ({ math }) => {
  try {
    // math must be string
    return <InlineMath math={math} />;
  } catch (e) {
    console.warn("KaTeX render failed:", e);
    return null; // hide output instead of crashing
  }
};

const Test = () => {
    const [userInput, setUserInput] = useState("");
    const [result, setResult] = useState(null);
    const [latex, setLatex] = useState(null);
    const [problem, setProblem] = useState(null);
    useEffect(() => {
        // const prob = generatePEMDASProblem(['+', '-', '*', '/', '^', '!'], 5, 100);
        // setProblem(prob[1]);

        const input = "2x^3";
        const tokens = tokenize(input);
        const rpn = shuntingYard(tokens);
        const lat = rpnToLatex(rpn);
        setProblem(lat);
    }, [])

    // useEffect(() => {
    //     console.log(problem);
    // }, [])

    useEffect(() => {
        if (userInput == "") {
            setLatex("");
            setResult(null);
            return;
        }
        try {
            const tokens = tokenize(userInput);
            const rpn = shuntingYard(tokens);

            const latexResult = rpnToLatex(structuredClone(rpn));
            setLatex(latexResult);
            
            const res = evaluateRPN(structuredClone(rpn), false);
            katex.renderToString(res);
            setResult(res);
        } catch (e) {
            console.log(e.message);
            setLatex(`\\text{${e.message}}`);
            setResult(null);
        }
    }, [userInput])
  return (
    <div className='p-4 flex flex-col gap-4 items-center'>
        <h1 className="text-3xl text-center">Testing</h1>
        <input type="text" className='px-2 py-1 w-[200px] border-2 border-black outline-0 rounded-xl' 
        value={userInput}
        onChange={(e) => {
            setUserInput(e.target.value);
        }}/>
        {result != null && 
        <h1 className="text-3xl text-center"
        style={{color: result.startsWith("\\text{") ? `red` : `black` }}>
            <InlineMath math={result} />
        </h1>}

        {latex != null && typeof latex === "string" &&
        <h1 className="text-3xl text-center">
            <SafeInlineMath math={latex} />
        </h1>}

        {problem != null &&
        <h1 className="text-3xl text-center">
            <SafeInlineMath math={problem} />
        </h1>}
    </div>
  )
}

export default Test