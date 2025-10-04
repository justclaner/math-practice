import { decimalToFraction, factorialApprox, constantValues } from "./logic";
import { functions, evaluateFunction, functionArguments } from "./functions";

const operators = new Set([
    '+','-',"*","/","^", "NEG", '!'
])

const constants = new Set([
    'π', 'e'
]);

const operatorPrecedence = new Map([
    ['!', 4],
    ['^', 3],
    ['NEG', 2],
    ['*', 1],
    ['/', 1],
    ['+', 0],
    ['-', 0]
])

const rightAssociative = new Set([
    '^',
    'NEG'
    ])

/**
 * 
 * @param {String} str A mathematical expression as a string.
 * @returns {Array}
 */
export const tokenize = (str) => {
    str = str.trim();

    let rawTokens = [];

    //filter once
    let i = 0;
    for (let j = 0; j < str.length; j++) {
        if (operators.has(str[j]) || str[j] == 'π' || str[j] == '(' || str[j] == ')' || str[j] == ',' || /[a-zA-Z]/.test(str[j])) {
            if (i < j) {
                rawTokens.push(Number(str.slice(i, j)));
            }
            rawTokens.push(str[j]);
            i = j + 1;
        } 
    }
    if (i < str.length) {
        if (!isNaN(Number(str.slice(i)))) {
            rawTokens.push(Number(str.slice(i)));
        } else {
            rawTokens.push(str.slice(i));
        }
    }
    
    //console.log(rawTokens);

    //put together functions
    let filteredTokens1 = [];
    let startIndex = -1;
    let endIndex = -1; //last index of an alphabetic symbol (not the one after)
    let checkingIsFunction = false;

    //filter second time for functions
    for (let j = 0; j < rawTokens.length; j++) {
        //if current token is an alphabet symbol, enter checkingIsFunction mode
        if (/[a-zA-Z]/.test(rawTokens[j])) {
            //set startIndex if currently entering the checkIsFunction mode, otherwise no
            if (!checkingIsFunction) {

                //invariant: no function starts with e, and e will be treated as a constant rather than a variable
                // if (rawTokens[j] == 'e') {
                //     filteredTokens1.push("e");
                //     continue;
                // }
                startIndex = j;
            }
            checkingIsFunction = true;
        } else {
            //seen a number, operator, or parentheses
            checkingIsFunction = false;

            //check if there are any alphabet symbols to parse before pushing the number/operator/parentheses token
            if (startIndex != -1 && endIndex != -1) {
                let text = "";
                //store alphabet symbols in text
                for (let k = startIndex; k <= endIndex; k++) {
                    text += rawTokens[k];
                }

                //if it is a recognized function, push it as so
                //handles case where it is variables and then a function (ex: abcsin(x)); note impossible for two consecutive functions
                let funcStartIdx = -1;
                //endIdx not needed because function is always last thing seen

                parseText: for (let k = 0; k < text.length; k++) {
                    //uses sliding-window; check longer functions first

                    //functions are at least 2 symbols and at most 8 symbols long (ex: arcsinh)
                    for (let l = 8; l > 1; l--) {
                        if (k + l - 1 < text.length && functions.has(text.slice(k, k + l))) {
                            funcStartIdx = k;
                            break parseText;
                        }
                    }
                }
                //push individually as variables until reaching funcStartIdx
                for (let k = startIndex; k <= endIndex; k++) {
                    //funcStartIdx has an initial value of -1, so impossible to reach if no function is seen
                    if (k == funcStartIdx + startIndex) {
                        filteredTokens1.push(text.slice(funcStartIdx));
                        break;
                    }
                    filteredTokens1.push(rawTokens[k]);
                } 

                //reset indices
                startIndex = -1;
                endIndex = -1;
            }
            filteredTokens1.push(rawTokens[j]);

        }

        if (checkingIsFunction) {
            endIndex = j;
            
            if (endIndex == rawTokens.length - 1) {
                //push individually as variables (if it ended without parenthesis, they must be variables)
                for (let k = startIndex; k <= endIndex; k++) {
                    filteredTokens1.push(rawTokens[k]);
                } 
            }
        }
    }

    //change each token in filteredTokens1 to be an object giving the information on what type of token it is
    //each filteredTokens1 element will be of an json object in the form {type: [type], value: [value]}
    for (let j = 0; j < filteredTokens1.length; j++) {
        let tok = filteredTokens1[j];
        let type = "";
        let newObj = {
            "type": "",
            "value": tok
        }
        //number is any decimal, a constant is a greek symbol or e
        if (typeof tok == "number") {
            type = "number";
        } else if (constants.has(tok)) {
            type = "constant";
        } else if (operators.has(tok)) {
            type = "operator";
        } else if (functions.has(tok)) {
            type = "function";
        } else if (tok == '(' || tok == ')') {
            type = "parenthesis"
        } else if (tok == ',') {
            type = "separator";
        } else if (tok.length == 1) {
            type = "variable";
        } else {
            type = "unknown";
        }

        newObj.type = type;
        filteredTokens1[j] = newObj;
    }

    //filter second time to add unary operation negative sign
    let filteredTokens2 = [];

    //handles case where first token is the minus operator (must mean negative number)
    if (filteredTokens1[0].value == '-') {
        filteredTokens2.push({
            "type": "operator",
            "value": "NEG"
        });
    } else {
        filteredTokens2.push(filteredTokens1[0]);
    }

    //parse rest of the tokens, starting from the second token
    for (let j = 1; j < filteredTokens1.length; j++) {
        const tok = filteredTokens1[j];

        //checks if the minus operator succeeds another operator or a left parenthesis
        if (tok.value == '-' && 
                (filteredTokens2[j - 1].type == "operator" || filteredTokens2[j - 1].value == "(")
            ) {
                filteredTokens2.push({
                    "type": "operator",
                    "value": "NEG"
                });
        } else {
            filteredTokens2.push(tok);
        }
    }

    //filter third time to add implicit multiplication (ex: between variables or between constants and parentheses)
    let filteredTokens3 = [filteredTokens2[0]];

    const multToken = {"type": "operator", "value": '*'}

    for (let j = 1; j < filteredTokens2.length; j++) {
        const tok = filteredTokens2[j];
        const prevTok = filteredTokens2[j - 1];
        const leftSide = new Set(["number", "constant", "variable", ')']);
        const rightSide = new Set(["number", "constant", "variable", "function", '('])
        
        //two consecutive number tokens are impossible but we handle that case anyways
        if ((leftSide.has(prevTok.type) || leftSide.has(prevTok.value)) && (rightSide.has(tok.type) || rightSide.has(tok.value))) {
            filteredTokens3.push(multToken);
        }

        filteredTokens3.push(tok);
    }

    return filteredTokens3;
}

/**
 * returns a mathematical expression in reverse polish notation as an array
 * @param {Array} tokens 
 * @returns {Array}
 */
export const shuntingYard = (tokens) => {
    if (typeof tokens != "object") {
        return;
    }

    let output = [];
    let operators = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const type = token.type;
        const value = token.value;
        if (type == "number" || type == "constant" || type == "variable") {
            output.push(token);
        } else if (type == "function") {
            operators.push(token);
        } else if (type == "operator") {
            while (operators.length > 0 
                && operators[operators.length - 1].value != '('
                && (operatorPrecedence.get(operators[operators.length - 1].value) > operatorPrecedence.get(value)
                    || (operatorPrecedence.get(operators[operators.length - 1].value) == operatorPrecedence.get(value))
                        && !rightAssociative.has(value)
                    )
                ) {
                    output.push(operators.pop());
            }
            operators.push(token);
        } else if (type == "separator") {
            while (operators.length > 0 && operators[operators.length - 1].value != '(') {
                output.push(operators.pop());
            }
        } else if (type == "parenthesis") {
            if (value == '(') {
                operators.push(token);
            } else if (value == ')') {
                if (operators.length == 0) {
                    return new Error("Mismatched parentheses!");
                }

                while (operators[operators.length - 1].value != '(') {
                    output.push(operators.pop());
                }

                //there should be a left-parenthesis at the top of the stack now
                if (operators.length == 0 || operators[operators.length - 1].value != '(') {
                    return new Error("Mismatched parentheses!");
                }

                operators.pop();
                if (operators.length > 0 && operators[operators.length - 1].type == "function") {
                    output.push(operators.pop());
                }
            }
        }
    }

    while (operators.length > 0) {
        if (operators[operators.length - 1].value == '(') {
            return new Error("Mismatched parentheses!");
        }
        output.push(operators.pop());
    }
    return output;
}

/**
 * returns a number given tokens in reverse polish notation;
 * returns undefined if there are any variables
 * @param {Array} tokens 
 * @param {boolean} fraction true if answer should have fractional coefficients
 * @param {boolean} absorbConstants true if constants should be absorbed into the coefficient
 */
export const evaluateRPN = (tokens, fraction, absorbConstants) => {
    let i = 0;
    while (i < tokens.length) {
        const type = tokens[i].type;
        const val = tokens[i].value;
        if (type == "variable") {
            return;
        }

        if (type == "number" || type == "constant") {
            i++;
            continue;
        }

        if (type == "operator") {
            if (val == '!') {
                if (i < 1) {
                    return new Error(`Not enough operands for operator (${val})!`);
                }

                if (tokens[i - 1].type == "constant") {
                    tokens[i - 1].type = "number";
                    tokens[i - 1].value = constantValues.get(tokens[i - 1].value);
                }

                if (tokens[i - 1].type != "number") {
                    return new Error(`Not a number!`);
                }
                tokens[i - 1].value = factorialApprox(tokens[i - 1].value);
                tokens.splice(i, 1);
            } else if (val == 'NEG') {
                if (i < 1) {
                    return new Error(`Not enough operands for operator (${val})!`);
                }

                if (tokens[i - 1].type == "constant") {
                    tokens[i - 1].type = "number";
                    tokens[i - 1].value = constantValues.get(tokens[i - 1].value);
                }

                if (tokens[i - 1].type != "number") {
                    return new Error(`Not a number!`);
                }
                tokens[i - 1].value *= -1;
                tokens.splice(i, 1);
            } else {
                if (i < 2) {
                    return new Error(`Not enough operands for operator (${val})!`);
                }

                if (tokens[i - 1].type == "constant") {
                    tokens[i - 1].type = "number";
                    tokens[i - 1].value = constantValues.get(tokens[i - 1].value);
                }

                if (tokens[i - 1].type != "number") {
                    return new Error(`Not a number!`);
                }

                if (tokens[i - 2].type == "constant") {
                    tokens[i - 2].type = "number";
                    tokens[i - 2].value = constantValues.get(tokens[i - 1].value);
                }

                if (tokens[i - 2].type != "number") {
                    return new Error(`Not a number!`);
                }
                const a = tokens[i - 2].value;
                const b = tokens[i - 1].value;

                switch (val) {
                    case '^':
                        tokens[i - 2].value = Math.pow(a, b);
                        break;
                    case '*':
                        tokens[i - 2].value = a * b;
                        break;
                    case '/':
                        tokens[i - 2].value = a / b;
                        break;
                    case '-':
                        tokens[i - 2].value = a - b;
                        break;
                    case '+':
                        tokens[i - 2].value = a + b;
                        break;
                }
                i--;
                tokens.splice(i, 2);
            }
        } else if (type == "function") {
            const numArgs = functionArguments.get(val);
            if (i < numArgs) {
                return new Error(`Expected ${numArgs} arguments for function ${val} but got ${i + 1} instead!`);
            }
            const args = tokens.slice(i - numArgs, i);
            let argVals = [];

            for (let j = 0; j < args.length; j++) {
                argVals.push(args[j].value);
            }

            tokens[i - numArgs] = {
                type: "number",
                value: evaluateFunction(val, argVals)
            }
            i -= (numArgs - 1);
            tokens.splice(i, numArgs);
        }
    }
    return tokens[0].value;
}