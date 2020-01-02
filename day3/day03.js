const fs = require('fs')
const { createCanvas } = require('canvas')

const text = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const [wire1, wire2] = text.split("\n").map(line => line.split(","));

// const wire1 = ["R75","D30","R83","U83","L12","D49","R71","U7","L72"]
// const wire2 = ["U62","R66","U55","R34","D71","R55","D58","R83"]
// const wire1 = ["R75","D30","R83","U83","L12","D49"]
// const wire2 = ["U62","R66","U55","R34","D71","R55"]

const canvas = createCanvas(500, 500)
const ctx = canvas.getContext('2d')
ctx.transform(1, 0, 0, -1, 0, canvas.height)
const out = fs.createWriteStream(__dirname + '/wires.png')

createMap([wire1, wire2])

function createMap(wires) {
  let currentPosition = { x: 0, y: 0 }
  const [wire1, wire2] = wires
  const map1 = wire1.map(code => {
    const lastPosition = currentPosition; // Old position
    currentPosition = getPosition(code, currentPosition)
    draw(lastPosition, currentPosition, "red", code)
    return { ...currentPosition, code };
  })

  console.log("Wire 1 done.")
  
  // Reset
  currentPosition = { x: 0, y: 0 }
  const map2 = wire2.map(code => {
    const lastPosition = currentPosition; // Old position
    currentPosition = getPosition(code, currentPosition)
    draw(lastPosition, currentPosition, "blue", code)
    return { ...currentPosition, code };
  })
  
  console.log("Wire 2 done.")
  
  let crossingPoints = [];
  // const [w1, w2] = Promise.all([getPoints(map1), getPoints(map2)])
  const w1 = getPoints(map1)
  const w2 = getPoints(map2)

  const points = getCrossingPoints(w1, w2)
  if (points) crossingPoints.push(...points)

  console.log("crossing points", crossingPoints)
  crossingPoints.forEach(point => draw(point, point, "cyan"))
  
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () => console.log('The PNG file was created.'))
}

function getPosition(code, coordinates) {
  const [key, ...num] = code
  let { x, y } = coordinates
  const value = parseInt(num.join(""))
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

function draw(lastPosition, currentPosition, color = "blue", code) {
  const isStartPoint = (lastPosition.x === 0 && lastPosition.y === 0) || false
  const lastX = lastPosition.x + 250
  const lastY = lastPosition.y + 250
  const x = currentPosition.x + 250
  const y = currentPosition.y + 250

  ctx.beginPath()
  ctx.strokeStyle = color
  if (isStartPoint) {
    ctx.font = "16px Arial";
    // ctx.fillText("x", lastX - 4, lastY + 4);
  } else {
    ctx.font = "16px Arial";
    ctx.fillRect(lastX - 1, lastY - 1, 2, 2)
  }
  // ctx.fillText(code, x - 4, y + 4);
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y)
  ctx.stroke()
}

function getPoints(wire) {
    // const points = pointsBetween(lastPosition, currentPosition)
    let w = [...wire]
    let segments = []

    while (w.length > 0) {
      const start = w.shift()
      const end = w[0]
      if (start && !end) {
        segments.push(...pointsBetween(start, start))
      } else {
        segments.push(...pointsBetween(start, end))
      }
    }
    return segments
  
}
function getCrossingPoints(wire1, wire2) {

  let matches = []
  // matches = points.filter(w1 => {
  //   return line2Points.some(w2 => w1.x === w2.x && w1.y === w2.y)
  // })
  for (const p of wire1) {
    for (const l of wire2) {
      if (p.x == l.x && p.y == l.y) matches.push({ ...p })
    }
  }
  return matches
}

function pointsBetween(line1, line2) {
  let points = []
  const maxX = Math.max(line1.x, line2.x)
  const maxY = Math.max(line1.y, line2.y)
  const minX = Math.min(line1.x, line2.x)
  const minY = Math.min(line1.y, line2.y)

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      points.push({ x, y })
    }
  }
  return points
}