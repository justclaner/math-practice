const operators = new Set([
    '+','-',"*","/","^", "NEG", '!'
])

const trigFunctions = new Set([
    'sin', 'cos', 'tan', 'csc', 'sec', 'cot'
]);

const expFunctions = new Set([
    'log', 'ln', 'sqrt', 'cbrt' 
]);

const functions = new Set([...trigFunctions, ...expFunctions]);

const constants = new Set([
    'π', 'e'
]);

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
        if (operators.has(str[j]) || str[j] == 'π' || str[j] == '(' || str[j] == ')' || /[a-zA-Z]/.test(str[j])) {
            if (i < j) {
                rawTokens.push(Number(str.slice(i, j)));
            }
            rawTokens.push(str[j]);
            i = j + 1;
        } 
    }

    //put together functions
    let filteredTokens1 = [];
    let startIndex = -1;
    let endIndex = -1; //last index of an alphabetic symbol (not the one after)
    let checkingIsFunction = false;

    //filter second time for functions
    for (let j = 0; j < rawTokens.length; j++) {
        console.log(rawTokens[j]);
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
            console.log("not letter!")
            //seen a number, operator, or parentheses
            checkingIsFunction = false;

            //check if there are any alphabet symbols to parse before pushing the number/operator/parentheses token
            if (startIndex != -1 && endIndex != -1) {
                console.log("seen a function???")
                let text = "";
                console.log(startIndex, endIndex)
                //store alphabet symbols in text
                for (let k = startIndex; k <= endIndex; k++) {
                    text += rawTokens[k];
                }
                console.log(text);

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
                console.log(`funcStartIdx: ${funcStartIdx}`);
                //push individually as variables until reaching funcStartIdx
                for (let k = startIndex; k <= endIndex; k++) {
                    console.log(`k ${k} == funcStartIdx ${funcStartIdx + startIndex}: ${k == funcStartIdx + startIndex}`)

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
        } else if (tok.length == 1) {
            type = "variable";
        } else {
            type = "unknown"
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
        const rightSide = new Set(["number", "constant", "variable", '('])
        
        //two consecutive number tokens are impossible but we handle that case anyways
        if ((leftSide.has(prevTok.type) || leftSide.has(prevTok.value)) && (rightSide.has(tok.type) || rightSide.has(tok.value))) {
            filteredTokens3.push(multToken);
        }

        filteredTokens3.push(tok);
    }

    return filteredTokens3;
}