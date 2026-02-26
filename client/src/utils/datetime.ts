const RE =
  /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})\s([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidDateTime(value: string): boolean {
  if (!RE.test(value)) return false;

  const [, mmStr, ddStr, yyyyStr] = value.match(RE)!;
  const mm = Number(mmStr);
  const dd = Number(ddStr);
  const yyyy = Number(yyyyStr);

  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  return dd >= 1 && dd <= daysInMonth;
}

export function hint(): string {
  return "MM/DD/YYYY HH:mm";
}