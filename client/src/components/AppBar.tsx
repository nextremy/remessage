export function AppBar(props: { title: string }) {
  return (
    <div className="flex h-12 items-center border-b border-gray-300 px-4">
      <h1 className="font-semibold">{props.title}</h1>
    </div>
  );
}
