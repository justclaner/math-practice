const trigFunctions = new Set([
    'sin', 'cos', 'tan', 'csc', 'sec', 'cot',
    'asin', 'acos', 'atan', 'acsc', 'asec', 'acot',
    'sinh', 'cosh', 'tanh', 'csch', 'sech', 'coth',
    'asinh', 'acosh', 'atanh', 'acsch', 'asech', 'acoth',
]);

const expFunctions = new Set([
    'log', 'lg', 'ln', 'sqrt', 'cbrt' 
]);

const miscFunctions = new Set([
    'min', 'max', 'abs'
])

export const functions = new Set([...trigFunctions, ...expFunctions, ...miscFunctions]);

export const functionArguments = new Map([
    ['sin', 1], ['cos', 1], ['tan', 1], ['csc', 1], ['sec', 1], ['cot', 1],
    ['asin', 1], ['acos', 1], ['atan', 1], ['acsc', 1], ['asec', 1], ['acot', 1],
    ['sinh', 1], ['cosh', 1], ['tanh', 1], ['csch', 1], ['sech', 1], ['coth', 1],
    ['asinh', 1], ['acosh', 1], ['atanh', 1], ['acsch', 1], ['asech', 1], ['acoth', 1],
    ['log', 1], ['lg'], ['ln'], ['sqrt', 1], ['cbrt', 1],
    ['min', 2], ['max', 2], ['abs', 1]
])

export const evaluateFunction = (functionName, args) => {
    if (args.length != functionArguments.get(functionName)) {
        return new Error(`Expected ${functionArguments.get(functionName)} argument(s) but found ${args.length} instead!`);
    }

    if (trigFunctions.has(functionName) || expFunctions.has(functionName)) {
        const num = args[0];
        if (Math[`${functionName}`] != undefined) {
            return Math[`${functionName}`](num);
        } else {
            switch (functionName) {
                case 'csc':
                    return 1 / Math.sin(num);
                case 'sec':
                    return 1 / Math.cos(num);
                case 'cot':
                    return 1 / Math.cot(num);
                case 'acsc':
                    return Math.asin(1 / num);
                case 'asec':
                    return Math.acos(1 / num);
                case 'acot':
                    return Math.atan(1 / num);
                case 'acsch':
                    return Math.asinh(1 / num);
                case 'asech':
                    return Math.acosh(1 / num);
                case 'acoth':
                    return Math.atanh(1 / num);
                case 'log':
                    return Math.log10(num);
                case 'lg':
                    return Math.log2(num);
                case 'ln':
                    return Math.log10(num) / Math.LOG10E;
            }
        }
    } else {
        if (functionName == "min") {
            const a = args[0];
            const b = args[1];
            return Math.min(a, b);
        } else if (functionName == "max") {
            const a = args[0];
            const b = args[1];
            return Math.max(a, b);
        } else if (functionName == "abs") {
            return Math.abs(args[0]);
        }
    }
}