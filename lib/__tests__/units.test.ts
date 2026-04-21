import { kgToLb, lbToKg, roundTenth } from "../units";

describe("units", () => {
  test("lbToKg converts pounds to kilograms", () => {
    expect(lbToKg(0)).toBe(0);
    expect(roundTenth(lbToKg(100))).toBe(45.4);
    expect(roundTenth(lbToKg(225))).toBe(102.1);
  });

  test("kgToLb converts kilograms to pounds", () => {
    expect(kgToLb(0)).toBe(0);
    expect(roundTenth(kgToLb(100))).toBe(220.5);
    expect(roundTenth(kgToLb(50))).toBe(110.2);
  });

  test("round-trip kg -> lb -> kg preserves value within rounding", () => {
    const kg = 60;
    const back = lbToKg(kgToLb(kg));
    expect(roundTenth(back)).toBe(60);
  });

  test("roundTenth rounds to one decimal", () => {
    expect(roundTenth(1.23456)).toBe(1.2);
    expect(roundTenth(1.25)).toBe(1.3);
    expect(roundTenth(0)).toBe(0);
  });
});
