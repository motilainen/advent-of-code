const fs = require('fs')
const { createCanvas } = require('canvas')

// const text = fs.readFileSync("./input.txt", { encoding: "utf-8" });
// const [wire1, wire2] = text.split("\n").map(line => line.split(","));

const wire1 = ["R75","D30","R83","U83","L12","D49","R71","U7","L72"]
const wire2 = ["U62","R66","U55","R34","D71","R55","D58","R83"]

const canvas = createCanvas(500, 500)
const ctx = canvas.getContext('2d')
const out = fs.createWriteStream(__dirname + '/wires.png')


createMap([wire1, wire2])

function createMap(wires) {
  let currentPosition = { x: 0, y: 0 }
  const [wire1, wire2] = wires
  const map1 = wire1.map(code => {
    const lastPosition = currentPosition; // Old position
    currentPosition = getPosition(code, currentPosition)
    draw(lastPosition, currentPosition, "red")
    return { ...currentPosition, code };
  })
  
  // Reset
  currentPosition = { x: 0, y: 0 }

  const map2 = wire2.map(code => {
    const lastPosition = currentPosition; // Old position
    currentPosition = getPosition(code, currentPosition)
    draw(lastPosition, currentPosition, "blue")
    return { ...currentPosition, code };
  })

  crossingPoints(map1, map2)
  console.log("map1",map1)
  console.log("map2",map2)

  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () => console.log('The PNG file was created.'))
}

function getPosition(code, coordinates) {
  const [key, ...num] = code
  let { x,y } = coordinates
  const value = parseInt(num.join(""))
  // console.log(key, value, code)
  switch (key) {
    case "U":
      y += value;
      break;
    case "D":
      y -= value;
      break;
    case "R":
      x += value;
      break;
    case "L":
      x -= value;
      break;
  
    default:
      break;
  }
  return { x, y }
}

function draw(lastPosition, currentPosition, color = "blue") {
  const isStartPoint = (lastPosition.x === 0 && lastPosition.y === 0) || false
  const lastX = lastPosition.x + 250
  const lastY = lastPosition.y + 250
  const x = currentPosition.x + 250
  const y = currentPosition.y + 250

  ctx.beginPath()
  ctx.strokeStyle = color
  if (isStartPoint) {
    ctx.font = "16px Arial";
    ctx.fillText("x", lastX - 4, lastY + 4);
  } else {
    ctx.fillRect(lastX - 1, lastY - 1, 2, 2)
  }
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y)
  ctx.stroke()
}

function crossingPoints(map1, map2) {
  
}