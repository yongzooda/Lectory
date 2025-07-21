export async function getCurrent() {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
