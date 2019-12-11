const modules = require('./input')

function fuel(mass, total = 0) {
    const fuelNeeded = Math.floor(mass / 3 - 2);
    if (fuelNeeded > 0) {
        total += fuelNeeded;
        return fuel(fuelNeeded, total)
    }
    console.log("Fuel needed for module: ", total)
    return total;
}

const fuelMap = modules.map(module => fuel(module))
const totalFuel = fuelMap.reduce((total, curr) => total + curr)

console.log("Total fuel needed: ", totalFuel)