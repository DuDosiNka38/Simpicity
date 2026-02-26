import { hint, isValidDateTime } from "../utils/datetime";

export default function DateTimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  console.log(value)
  const trimmed = value.trim();
  const ok = isValidDateTime(trimmed);

  return (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={hint()} />
      {!ok ? <div>Invalid format. Use {hint()}</div> : null}
    </div>
  );
}