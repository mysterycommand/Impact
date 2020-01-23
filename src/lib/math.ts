export const {
  abs,
  atan2,
  ceil,
  cos,
  floor,
  hypot,
  max,
  min,
  PI: π,
  round,
  sin,
  sqrt,
} = Math;

export function toRadians(degrees: number) {
  return (degrees / 180) * π;
}

export function toDegrees(radians: number) {
  return (radians * 180) / π;
}

export function isBetween(
  lowerBound: number,
  upperBound: number,
  value: number,
  lowerBoundInclusive = true,
  upperBoundInclusive = false,
) {
  if (upperBound < lowerBound) {
    [lowerBound, upperBound] = [upperBound, lowerBound];
  }

  return (
    (lowerBoundInclusive ? lowerBound <= value : lowerBound < value) &&
    (upperBoundInclusive ? value <= upperBound : value < upperBound)
  );
}

export function isOutside(
  lowerBound: number,
  upperBound: number,
  value: number,
  lowerBoundInclusive = false,
  upperBoundInclusive = true,
) {
  if (upperBound < lowerBound) {
    [lowerBound, upperBound] = [upperBound, lowerBound];
  }

  return (
    (lowerBoundInclusive ? value <= lowerBound : value < lowerBound) &&
    (upperBoundInclusive ? upperBound <= value : upperBound < value)
  );
}
