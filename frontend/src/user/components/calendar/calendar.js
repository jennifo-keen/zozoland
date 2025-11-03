export function buildMonthMatrixUTC(year, month, weekStartMon = true) {
  // month: 1..12
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end   = new Date(Date.UTC(year, month, 0)); // last day of month

  const toMonIdx = (weekdaySun0) => weekStartMon ? (weekdaySun0 + 6) % 7 : weekdaySun0;
  const firstWeekdayMon0 = toMonIdx(start.getUTCDay()); // 0..6 (Mon..Sun)

  const days = [];
  // ô trống trước ngày 1
  for (let i = 0; i < firstWeekdayMon0; i++) days.push(null);
  // 1..last
  for (let d = 1; d <= end.getUTCDate(); d++) {
    days.push(new Date(Date.UTC(year, month - 1, d)));
  }
  // pad cuối để chia hết cho 7
  while (days.length % 7 !== 0) days.push(null);

  const rows = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  return rows;
}
