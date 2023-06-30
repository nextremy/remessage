export function AppBar(props: { title: string }) {
  return (
    <div className="flex h-16 items-center border-b border-zinc-800 px-4">
      <h1 className="text-lg font-semibold">{props.title}</h1>
    </div>
  );
}
