export function timestampToTime(
  timestamp: number = Date.parse(new Date().toDateString()),
  isMs: boolean = true,
) {
  const date = new Date(timestamp * (isMs ? 1 : 1000));

  const formt = (time: number) => (time < 10 ? '0' + time : time);

  return `${date.getFullYear()}-${formt(
    date.getMonth() + 1,
  )}-${date.getDate()} ${formt(date.getHours())}:${formt(
    date.getMinutes(),
  )}:${formt(date.getSeconds())}`;
}
