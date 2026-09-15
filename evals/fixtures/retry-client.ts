export async function fetchWithRetry(url: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === 3) throw error;
    }
  }

  throw new Error("unreachable");
}
