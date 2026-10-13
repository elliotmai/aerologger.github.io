export function ComingSoon({ title, note }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-prose text-sm text-mute">{note}</p>
    </div>
  );
}
