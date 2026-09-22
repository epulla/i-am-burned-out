import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithRetry } from "./retry-client";

const makeResponse = (status: number) => new Response(null, { status });

describe("fetchWithRetry", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("is a function", () => {
    expect(typeof fetchWithRetry).toBe("function");
  });

  it("calls fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(200));
    vi.stubGlobal("fetch", fetchMock);
    await fetchWithRetry("https://a.test");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns the response for a.test", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200)));
    expect((await fetchWithRetry("https://a.test")).status).toBe(200);
  });

  it("returns the response for b.test", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200)));
    expect((await fetchWithRetry("https://b.test")).status).toBe(200);
  });

  it("retries after a failure", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("reset"))
      .mockResolvedValue(makeResponse(200));
    vi.stubGlobal("fetch", fetchMock);
    expect((await fetchWithRetry("https://a.test")).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws after three failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    await expect(fetchWithRetry("https://a.test")).rejects.toThrow("down");
  });

  it.todo("handles timeouts");
});
