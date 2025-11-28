export function serverFetch(input: string, init?: RequestInit) {
  if (input.startsWith("/")) {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";

    return fetch(base + input, init);
  }

  return fetch(input, init);
}

