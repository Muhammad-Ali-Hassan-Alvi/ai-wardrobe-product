import type { TryOnInput, TryOnJobResult, TryOnProvider } from "./try-on-provider";
import { TryOnProviderNotImplementedError } from "./try-on-provider";

/** Replicate adapter — Sprint 1+ */
export class ReplicateTryOnProvider implements TryOnProvider {
  readonly name = "replicate";

  async submitJob(_input: TryOnInput): Promise<TryOnJobResult> {
    throw new TryOnProviderNotImplementedError(this.name, "submitJob");
  }

  async getJobStatus(_jobId: string): Promise<TryOnJobResult> {
    throw new TryOnProviderNotImplementedError(this.name, "getJobStatus");
  }
}
