export function isPositiveIntegerString(str) {
    const integerRegex = /^\d+$/;

    if (integerRegex.test(str)) {
        return parseInt(str, 10);
    }

    return null;
}