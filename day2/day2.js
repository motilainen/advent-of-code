const input = require('./input')

function run(integers, position = 0) {
    const opcode = integers[position];
    // Input positions
    const idx1 = integers[position + 1]
    const idx2 = integers[position + 2]
    const val1 = integers[idx1]
    const val2 = integers[idx2]
    // Output position
    const outputIdx = integers[position + 3]
    
    switch (opcode) {
        case 1:
            console.log("Adding", val1, val2)
            integers[outputIdx] = val1 + val2;
            break;
        case 2:
            console.log("Multiplying", val1, val2)
            integers[outputIdx] = val1 * val2;
            break;
        case 99:
            console.log("Code 99. Exiting.")
            return integers
        default:
            console.log("Error! Code was not 1, 2 or 99.")
            return integers;
    }
    position += 4;
    return run(integers, position)
}

function findValue(value) {
    // address 0 = output
    // address 1 = noun
    // address 2 = verb
    
    for (let i = 0; i < 100; i++) {
        let newInput = resetInput();
        for (let p = 0; p < 100; p++) {
            newInput[2] = p;
            newInput[1] = i;
            const [result, noun, verb] = run(newInput)
            if (result === value) return [result, noun, verb]
            newInput = resetInput()
        }
    }
}

function resetInput() {
    return [...input];
}

const result = run(input)
const values = findValue(19690720)
console.log("values", values)
console.log("result", result)
