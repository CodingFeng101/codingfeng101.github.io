import test from "node:test";
import assert from "node:assert/strict";
import { getGithubRepoStats } from "./githubStats.js";

function makeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

const cacheKey = "github-repo-stats:v1:CodingFeng101/UniGraph";
const cached = { stats: { stars: 7, forks: 2 }, fetchedAt: 1_000 };

test("uses fresh cached counts without requesting GitHub", async () => {
  const storage = makeStorage({ [cacheKey]: JSON.stringify(cached) });
  let requests = 0;
  const result = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    now: 1_000 + 60_000,
    fetchImpl: async () => { requests += 1; },
  });

  assert.deepEqual(result, { stars: 7, forks: 2 });
  assert.equal(requests, 0);
});

test("refreshes expired cached counts from GitHub", async () => {
  const storage = makeStorage({ [cacheKey]: JSON.stringify(cached) });
  let requests = 0;
  const result = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    now: 1_000 + 12 * 60 * 60 * 1000,
    fetchImpl: async (url) => {
      requests += 1;
      assert.equal(url, "https://api.github.com/repos/CodingFeng101/UniGraph");
      return { ok: true, json: async () => ({ stargazers_count: 11, forks_count: 4 }) };
    },
  });

  assert.deepEqual(result, { stars: 11, forks: 4 });
  assert.equal(requests, 1);
  assert.deepEqual(JSON.parse(storage.getItem(cacheKey)), {
    stats: { stars: 11, forks: 4 },
    fetchedAt: 1_000 + 12 * 60 * 60 * 1000,
  });
});

test("returns stale cached counts when refresh fails", async () => {
  const storage = makeStorage({ [cacheKey]: JSON.stringify(cached) });
  const result = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    now: 1_000 + 13 * 60 * 60 * 1000,
    fetchImpl: async () => { throw new Error("offline"); },
  });

  assert.deepEqual(result, { stars: 7, forks: 2 });
});

test("returns null for malformed or unavailable data without a cache", async () => {
  const storage = makeStorage();
  const malformed = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    fetchImpl: async () => ({ ok: true, json: async () => ({ stargazers_count: "11", forks_count: -1 }) }),
  });
  const unavailable = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    fetchImpl: async () => ({ ok: false, json: async () => ({}) }),
  });

  assert.equal(malformed, null);
  assert.equal(unavailable, null);
  assert.equal(storage.getItem(cacheKey), null);
});

test("fetches and caches valid counts when no prior cache exists", async () => {
  const storage = makeStorage();
  const result = await getGithubRepoStats("CodingFeng101", "UniGraph", {
    storage,
    now: 42,
    fetchImpl: async () => ({ ok: true, json: async () => ({ stargazers_count: 18, forks_count: 6 }) }),
  });

  assert.deepEqual(result, { stars: 18, forks: 6 });
  assert.deepEqual(JSON.parse(storage.getItem(cacheKey)), {
    stats: { stars: 18, forks: 6 },
    fetchedAt: 42,
  });
});

test("still fetches counts when browser storage is unavailable", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() { throw new Error("storage denied"); },
  });

  try {
    const result = await getGithubRepoStats("CodingFeng101", "UniGraph", {
      fetchImpl: async () => ({ ok: true, json: async () => ({ stargazers_count: 3, forks_count: 1 }) }),
    });
    assert.deepEqual(result, { stars: 3, forks: 1 });
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete globalThis.localStorage;
  }
});
