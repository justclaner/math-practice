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

export const gcf = (a, b) => {
    if (b == 0) {
        return a;
    }
    return gcf(b, a % b);
}

export const lcm = (a, b) => {
    return a * b / gcf(a, b);
}

/**
 * returns an array [numerator, denominator] representing the fraction based on
 * the Stern-Brocot Tree Search
 * @param {Number} decimal 
 */
export const decimalToFraction = (decimal, tolerance = 1e-20) => {
  if (typeof decimal != "number" || !isFinite(decimal)) return [NaN, NaN];

  let sign = Math.sign(decimal);
  decimal = Math.abs(decimal);

  if (Math.floor(decimal) == decimal) {
    return [sign * decimal, 1];
  }

  let lower_n = 0;
  let lower_d = 1;
  let upper_n = 1;
  let upper_d = 0;

  while (true) {
    const middle_n = lower_n + upper_n;
    const middle_d = lower_d + upper_d;

    if (middle_d * (decimal + tolerance) < middle_n) {
      // too high
      upper_n = middle_n;
      upper_d = middle_d;
    } else if (middle_n < (decimal - tolerance) * middle_d) {
      // too low
      lower_n = middle_n;
      lower_d = middle_d;
    } else {
      let g = gcf(middle_n, middle_d);
      return [sign * (middle_n / g), middle_d / g];
    }
  }
};

export const gammaApprox = (z) => {
    if (z == 1) {
        return 1;
    }

    // handles negative integers (undefined for gamma function)
    if (z <= 0 && Number.isInteger(z)) {
        return Infinity;
    }
    
    // handles negative non-integers, use the reflection formula
    // Γ(z)Γ(1-z) = π/sin(πz)
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gammaApprox(1 - z));
    }
    
    // Lanczos approximation coefficients (g=7, n=9)
    const g = 7;
    const coef = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    
    // Shift z for the Lanczos formula
    z -= 1;
    
    let x = coef[0];
    for (let i = 1; i < coef.length; i++) {
        x += coef[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    const result = Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    
    return Number.isInteger(z) && z >= 0 ? Math.floor(result) : result;
};


export const constantValues = new Map([
    ['π', Math.PI],
    ['e', Math.E]
])