/** Embedding utilities — implement when vector search is needed (post-V1) */

export interface EmbeddingService {
  embed(text: string): Promise<number[]>;
}
