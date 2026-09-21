import autocannon from "autocannon";

const baseUrl = process.env.PERF_BASE_URL;
const allowed = process.env.ALLOW_PERFORMANCE_TESTS === "true";

if (!baseUrl || !allowed) {
  console.error("Performance tests are safety-gated. Set PERF_BASE_URL and ALLOW_PERFORMANCE_TESTS=true for a dedicated test environment.");
  process.exit(2);
}

const target = new URL("/login", baseUrl).toString();
const result = await autocannon({
  url: target,
  connections: Number(process.env.PERF_CONNECTIONS ?? 10),
  duration: Number(process.env.PERF_DURATION_SECONDS ?? 15),
  pipelining: 1,
});

console.log(autocannon.printResult(result));

const p99Limit = Number(process.env.PERF_P99_LIMIT_MS ?? 1500);
const errorRate = result.errors / Math.max(result.requests.total, 1);
if (result.latency.p99 > p99Limit || errorRate > 0.01 || result.non2xx > 0) {
  console.error(`Performance budget failed: p99=${result.latency.p99}ms, errorRate=${errorRate}, non2xx=${result.non2xx}`);
  process.exit(1);
}
