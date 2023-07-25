export function useSession() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (userId === null || token === null) {
    throw new Error();
  }
  return { userId, token };
}
