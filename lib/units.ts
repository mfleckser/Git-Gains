const LB_PER_KG = 2.2046226218;
const KG_PER_LB = 0.45359237;

export function lbToKg(lbs: number): number {
  return KG_PER_LB * lbs;
}

export function kgToLb(kgs: number): number {
  return LB_PER_KG * kgs;
}

export function roundTenth(n: number): number {
  return Math.round(n * 10) / 10;
}
