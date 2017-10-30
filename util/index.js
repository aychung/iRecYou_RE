
function getGaussianRandom(mean, standardDeviation) { 
  return () => { 
    let q, u, v, p; 
    do { 
      u = 2.0 * Math.random() - 1.0; 
      v = 2.0 * Math.random() - 1.0; 
      q = u * u + v * v; 
    } while (q >= 1.0 || q === 0); 
    p = Math.sqrt(-2.0 * Math.log(q) / q); 
    return mean + standardDeviation * u * p; 
  }; 
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pad2(number) {
   return (number < 10 ? '0' : '') + number;
}

module.exports = {
  getGaussianRandom,
  randomDate,
  pad2
};