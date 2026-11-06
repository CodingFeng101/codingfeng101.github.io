export const GITHUB_STATS_CACHE_TTL = 12 * 60 * 60 * 1000;

function readCache(storage, key) {
  try {
    const cached = JSON.parse(storage?.getItem(key) ?? "null");
    const { stars, forks } = cached?.stats ?? {};
    if (
      Number.isInteger(stars) && stars >= 0
      && Number.isInteger(forks) && forks >= 0
      && Number.isFinite(cached.fetchedAt)
    ) {
      return cached;
    }
  } catch {
    // Ignore unavailable storage and malformed cache entries.
  }
  return null;
}

export async function getGithubRepoStats(owner, repo, options = {}) {
  const key = `github-repo-stats:v1:${owner}/${repo}`;
  let storage = options.storage;
  if (!storage) {
    try {
      storage = globalThis.localStorage;
    } catch {
      storage = null;
    }
  }
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const now = options.now ?? Date.now();
  const cached = readCache(storage, key);

  if (cached && now >= cached.fetchedAt && now - cached.fetchedAt < GITHUB_STATS_CACHE_TTL) {
    return cached.stats;
  }

  try {
    const response = await fetchImpl(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) return cached?.stats ?? null;

    const repository = await response.json();
    const stats = {
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };
    if (
      !Number.isInteger(stats.stars) || stats.stars < 0
      || !Number.isInteger(stats.forks) || stats.forks < 0
    ) {
      return cached?.stats ?? null;
    }

    try {
      storage?.setItem(key, JSON.stringify({ stats, fetchedAt: now }));
    } catch {
      // Counts remain usable for this visit if browser storage is unavailable.
    }
    return stats;
  } catch {
    return cached?.stats ?? null;
  }
}
