import { operators, tokenize, shuntingYard, evaluateRPN, rpnToLatex } from "./parser";

//vary distribution of operators in operations to weigh certain operators
export const generatePEMDASProblem = (operations, operationCount, maxAbsAns) => {
    if (!(new Set(operations)).isSubsetOf(operators)) {
        return;
    }
    let i = 0;
    let numberTokens = 0;
    let tokens = [];

    while (i < operationCount) {
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let numPool = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        switch (operation) {
            case '!':
                numPool = [
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5,
                    0, 1
                ]
                break;
            case '^':
                numPool = [
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    2, 3, 4, 5, 
                    0, 1
                ]
                break;
            default:
                break;
        }

        if (operation == '!' || operation == 'NEG') {
            if (numberTokens < 1) {
                tokens.push({
                    type: "number",
                    value: numPool[Math.floor(Math.random() * numPool.length)]
                });
                numberTokens++;
            }
        } else {
            while (numberTokens < 2) {
                if (Math.random() <= 0.5) {
                    tokens = [{
                        type: "number",
                        value: numPool[Math.floor(Math.random() * numPool.length)]
                    }, ...tokens];
                } else {
                    tokens.push({
                        type: "number",
                        value: numPool[Math.floor(Math.random() * numPool.length)]
                    });
                }
                numberTokens++;
            }
            numberTokens--;
        }

        tokens.push({
            type: "operator",
            value: operation
        })
        i++;
    }

    const answer = evaluateRPN(structuredClone(tokens));
    if (answer.startsWith("\\text{") || !Number.isInteger(Number(answer)) 
        || Math.abs(Number(answer)) > maxAbsAns || Math.abs(Number(answer)) == 0 || Math.abs(Number(answer)) == 1) {
        return generatePEMDASProblem(operations, operationCount, maxAbsAns);
    }
    
    return [answer, rpnToLatex(structuredClone(tokens))];
}