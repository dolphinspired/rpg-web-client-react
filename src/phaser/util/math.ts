export function parseIntOrDefault(val: string | undefined, def: number): number {
  if (val === undefined || val === "") {
    return def;
  }

  var int = parseInt(val, 10);
  if (isNaN(int)) {
    return def;
  }

  return int;
}

export function clamp(val: number, min: number, max: number) {
  return val < min ? min : val > max ? max : val;
}