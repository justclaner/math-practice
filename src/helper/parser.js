const operators = new Set([
    '+','-',"*","/","^", "NEG", '!'
])

const trigFunctions = new Set([
    'sin', 'cos', 'tan', 'csc', 'sec', 'cot'
]);

const expFunctions = new Set([
    'log', 'ln', 'sqrt', 'cbrt' 
]);

const functions = trigFunctions.union(expFunctions);


const constants = new Set([
    'π', 'e'
]);

/**
 * 
 * @param {String} str A mathematical expression as a string.
 * @returns {Array}
 */
export const tokenize = (str) => {
    str = str.toLowerCase();

    let tokens = [];
    let i = 0;

    //split by numbers
    for (let j = 0; j < str.length; j++) {
        const ascii = str.charCodeAt(j);
        if (ascii >= 48 && ascii <= 57) {
            continue;
        }

        if (i != j) {
            tokens.push(Number(str.slice(i, j)));
        }
        tokens.push(str.slice(j, j + 1));
        i = j + 1;
    }

    if (i < str.length && !isNaN(Number(str.slice(i)))) {
        tokens.push(Number(str.slice(i)));
    }

    for (let j = 1; j < tokens.length; j++) {
        //token should never be a combination of letters and numbers
        if (/[a-df-z]/.test(tokens[j]) && /[a-df-z]/.test(tokens[j - 1])) {
            tokens[j - 1] += tokens[j];
            tokens.splice(j, 1);
            j--;
        }
    }

    //change some dashes to 'NEG' unary operator and adds multiplication tokens for parenthesis
    if (tokens[0] == '-') {
        tokens[0] = "NEG";
    }

    i = 0;

    while (i < tokens.length) {
        if (tokens[i] == '-') {
            if (tokens[i - 1] == "NEG" || tokens[i - 1] == '(' || tokens[i - 1] == '-') {
                tokens[i] = "NEG";
            }
        } else if (i > 0 && tokens[i - 1] == ')' && tokens[i] == '(') {
            tokens.splice(i, 0, '*');
            i++;
        }
        else if (typeof tokens[i] == "number" || constants.has(tokens[i])) {
            const leftToken = tokens[i - 1];
            //consecutive number tokens are impossible
            if (leftToken == ')' || typeof leftToken == "number" || constants.has(leftToken)) {
                tokens.splice(i, 0, '*');
                i++;
                if (i + 1 < tokens.length) {
                    const rightToken = tokens[i + 1];
                    if (rightToken == '(' || typeof rightToken == "number" || constants.union(functions).has(rightToken)) {
                        tokens.splice(i + 1, 0, '*');
                        i++;
                    }
                }
            }
        }

        i++;
    }

    return tokens;
}