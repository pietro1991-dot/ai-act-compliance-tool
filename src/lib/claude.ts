export async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY environment variable is not set");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Claude API error (${res.status}): ${error}`);
      }

      const data = await res.json();
      return data.content[0].text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw lastError ?? new Error("Claude API call failed after retries");
}
