function rollDice(expr) {
  // expr: "2d6+3"
  const [dicePart, mod] = expr.split('+');
  const [num, sides] = dicePart.split('d').map(Number);
  let total = (mod ? parseInt(mod) : 0);
  for (let i = 0; i < num; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

function d20() {
  return Math.floor(Math.random() * 20) + 1;
}