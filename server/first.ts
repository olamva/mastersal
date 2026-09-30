export type FirstMonth = { month: string; counts: Record<string, number> };

export const isFirstMonth = (value: unknown): value is FirstMonth => {
  const { month, counts } = (value ?? {}) as Partial<FirstMonth>;
  return (
    typeof month === "string" &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(month) &&
    typeof counts === "object" &&
    counts !== null &&
    Object.values(counts).every(
      (count) => Number.isInteger(count) && count >= 0,
    )
  );
};

export const series = (months: FirstMonth[]) =>
  [...new Set(months.flatMap(({ counts }) => Object.keys(counts).sort()))].map(
    (name) => {
      let total = 0;
      return {
        name,
        totals: months.map(({ counts }) => (total += counts[name] ?? 0)),
      };
    },
  );

export const standings = (months: FirstMonth[]) =>
  series(months)
    .map(({ name, totals }) => ({ name, total: totals.at(-1) ?? 0 }))
    .sort(
      (left, right) =>
        right.total - left.total || left.name.localeCompare(right.name, "nb"),
    )
    .map((row, _, rows) => ({
      ...row,
      rank: rows.findIndex(({ total }) => total === row.total) + 1,
    }));

export const monthName = (month: string) =>
  new Date(`${month}-01`).toLocaleDateString("nb-NO", {
    month: "long",
    year: "numeric",
  });

export const days = (total: number) =>
  `${total} ${total === 1 ? "dag" : "dager"}`;
