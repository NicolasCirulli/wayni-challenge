import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { formatDate } from "@/utils/format-date";

describe("formatDate", () => {
  afterEach(() => { jest.useRealTimers() });

  it("muestra Hoy cuando la fecha corresponde al día actual", () => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date(2026, 8, 8, 18, 0),
    );

    const date = new Date(2026, 8, 8, 14, 30);

    expect(formatDate(date)).toBe("Hoy · 14:30");
  });

  it("muestra Ayer cuando la fecha corresponde al día anterior", () => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date(2026, 8, 8, 18, 0),
    );

    const date = new Date(2026, 8, 7, 9, 5);

    expect(formatDate(date)).toBe("Ayer · 09:05");
  });

  it("muestra la fecha cuando no corresponde a hoy ni ayer", () => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date(2026, 8, 8, 18, 0),
    );

    const date = new Date(2026, 8, 5, 12, 15);

    const expectedDate = date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    });

    expect(formatDate(date)).toBe(
      `${expectedDate} · 12:15`,
    );
  });
});