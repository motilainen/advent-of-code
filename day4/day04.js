
const min = 254032
const max = 789860
let passwords = []

for (let pw = min; pw < max; pw++) {
    if (isValid(pw)) {
        passwords.push(pw)
        console.log("valid", pw)
    }
}
console.log("Total ", passwords.length)

function isValid(num) {
    if (!numberIncreases(num)) return false
    if (!hasAdjacentNum(num)) return false
    return true
}

function numberIncreases(num) {
    const str = num.toString().split("").map(n => parseInt(n))
    for (let i = 0; i < str.length; i++) {
        if (str[i + 1] && str[i + 1] < str[i]) return false
        if (str[i] < str[i -1]) return false
    }
    return true
}

function hasAdjacentNum(num) {
    const str = num.toString().split("").map(n => parseInt(n))
    let occurences = {}
    for (let i = 0; i < str.length; i++) {
        if (str[i] == str[i + 1]) {
            occurences[str[i]] = (occurences[str[i]] || 1) + 1
        }
    }
    if (Object.keys(occurences).length > 1) {
        const match = Object.values(occurences).some(value => value === 2)
        return match
    }
    return Object.values(occurences)[0] == 2
}