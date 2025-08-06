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