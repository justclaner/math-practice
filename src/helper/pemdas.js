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
        let min = 2;
        let max = 10;
        switch (operation) {
            case '!':
                min = 0;
                max = 5;
                break;
            case '^':
                min = 0;
                max = 5;
                break;
            default:
                break;
        }



        if (operation == '!' || operation == 'NEG') {
            if (numberTokens < 1) {
                tokens.push({
                    type: "number",
                    value: Math.floor(Math.random() * (max - min)) + min
                });
                numberTokens++;
            }
        } else {
            if (operation == '^' && Math.random() <= 0.5) {
                while (numberTokens < 2) {
                    tokens = [{
                        type: "number",
                        value: Math.floor(Math.random() * (max - min)) + min
                    }, ...tokens];
                    numberTokens++;
                }
                numberTokens--;
            } else {
                while (numberTokens < 2) {
                    tokens.push({
                        type: "number",
                        value: Math.floor(Math.random() * (max - min)) + min
                    });
                    numberTokens++;
                }
                numberTokens--;
            }
        }

        tokens.push({
            type: "operator",
            value: operation
        })
        i++;
    }

    const answer = evaluateRPN(structuredClone(tokens));
    if (answer.startsWith("\\text{") || !Number.isInteger(Number(answer)) || Math.abs(Number(answer)) > maxAbsAns) {
        return generatePEMDASProblem(operations, operationCount, maxAbsAns);
    }
    
    return [answer, rpnToLatex(structuredClone(tokens))];
}