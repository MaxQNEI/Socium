export function Random(a, b) {
  return Math.round(Math.random() * (b - a) + a);
}

export default {
  Random,
};
