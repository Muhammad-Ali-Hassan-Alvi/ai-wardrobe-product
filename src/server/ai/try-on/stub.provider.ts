import type { TryOnInput, TryOnJobResult, TryOnProvider } from "./try-on-provider";

/** Local development stub — returns input photo as placeholder result */
export class StubTryOnProvider implements TryOnProvider {
  readonly name = "stub";

  async submitJob(input: TryOnInput): Promise<TryOnJobResult> {
    return {
      jobId: `stub_${Date.now()}`,
      status: "completed",
      resultUrl: input.userPhotoUrl,
    };
  }

  async getJobStatus(jobId: string): Promise<TryOnJobResult> {
    return { jobId, status: "completed" };
  }
}
