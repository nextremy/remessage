export function useSession() {
  const id = localStorage.getItem("userId");
  if (id === null) throw new Error();
  return { id };
}
