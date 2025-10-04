import {useState, useEffect} from 'react'
import { tokenize, shuntingYard, evaluateRPN } from '../helper/parser'

const Test = () => {
    const [userInput, setUserInput] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (userInput == "") {
            return;
        }
        try {
            const tokens = tokenize(userInput);
            const rpn = shuntingYard(tokens);
            const res = evaluateRPN(rpn);
            if (!isNaN(res)) {
                setResult(res);
            } else {
                setResult(null);
            }
        } catch (e) {
            console.log(e);
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
        {result != null && <h1 className="text-3xl text-center">{result}</h1>}
    </div>
  )
}

export default Test