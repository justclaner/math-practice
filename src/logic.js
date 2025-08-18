export const letterGrade = (percent) => {
    if (percent == 1) {
        return 'A++ (PERFECT)';
    } else if (percent >= 0.97) {
        return 'A+ (NEARLY PERFECT)';
    } else if (percent >= 0.93) {
        return 'A (EXCELLENT)';
    } else if (percent >= 0.90) {
        return 'A- (Good)';
    } else if (percent >= 0.87) {
        return 'B+ (Okay)';
    } else if (percent >= 0.83) {
        return 'B (Still okay)';
    } else if (percent >= 0.80) {
        return 'B- (Maybe okay)';
    } else if (percent >= 0.77) {
        return 'C+ (Not okay)';
    } else if (percent >= 0.73) {
        return 'C (Having a bad day?)';
    } else if (percent >= 0.70) {
        return 'C- (Bad)';
    } else if (percent >= 0.67) {
        return 'D+ (Very bad)';
    } else if (percent >= 0.63) {
        return 'D (You serious?)';
    } else if (percent >= 0.60) {
        return 'D- (Barely hanging on)';
    } else {
        return 'F (!!!!)'
    }
}

const singleDigits = new Map([
    [0, 'zero'],
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
    [4, 'four'],
    [5, 'five'],
    [6, 'six'],
    [7, 'seven'],
    [8, 'eight'],
    [9, 'nine']
]);

const teens = new Map([
    [11, 'eleven'],
    [12, 'twelve'],
    [13, 'thirteen'],
    [14, 'fourteen'],
    [15, 'fifteen'],
    [16, 'sixteen'],
    [17, 'seventeen'],
    [18, 'eighteen'],
    [19, 'nineteen'],
]);

const tens = new Map([
    [0, ''],
    [10, 'ten'],
    [20, 'twenty'],
    [30, 'thirty'],
    [40, 'forty'],
    [50, 'fifty'],
    [60, 'sixty'],
    [70, 'seventy'],
    [80, 'eighty'],
    [90, 'ninety']
])

//supports up to 999,999,999,999
export const numToText = (num) => {
    console.log(num);
    if (num == 0) {
        console.log("returning zero");
        return "zero";
    }
    const maxDigits = 12;
    let digits = new Array(maxDigits).fill(0);
    for (let i = 0; i < digits.length; i++) {
        digits[i] = Math.floor(num / Math.pow(10, maxDigits - i - 1)) % 10;
    }
    console.log(digits);
    let text = "";
    let groups = ['billion ', 'million ', 'thousand ', ''];

    for (let j = 0; j < groups.length; j++) {
        let index = 3 * j;
        if ((digits[index] | digits[index + 1] | digits[index + 2]) == 0) {
            continue;
        }
        if (digits[index] > 0) {
            text += `${singleDigits.get(digits[index])} hundred `;
        }

        if (digits[index + 1] == 1) {
            if (digits[index + 2] > 0) {
                text += `${teens.get(10 * digits[index + 1] + digits[index + 2])} `;
            } else {
                text += `ten `;
            }
        } else {
            if (digits[index + 1] > 1) {
                text += `${tens.get(10 * digits[index + 1])} `;
            }
            if (digits[index + 2] > 0) {
                text += `${singleDigits.get(digits[index + 2])} `;
            }
        }

        //if either one is more than 0
        if ((digits[index] | digits[index + 1] | digits[index + 2]) > 0) {
            text += groups[j];
        }
    }

    if (digits[0] > 0) {
        text += `${singleDigits.get(digits[0])} hundred `;
    }

    return text.trim();
}