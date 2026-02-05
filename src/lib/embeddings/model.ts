// src/lib/embeddings/model.ts
import { pipeline, env } from "@xenova/transformers";

// Disable local model loading (use cached models)
env.allowLocalModels = false;

// We don't need sharp for text embeddings
env.backends.onnx.wasm.numThreads = 1;

let embeddingPipeline: any = null;

export async function getEmbeddingModel() {
  if (!embeddingPipeline) {
    // Use the small and fast all-MiniLM-L6-v2 model (384 dimensions)
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<Float32Array> {
  const model = await getEmbeddingModel();
  const output = await model(text, { pooling: "mean", normalize: true });
  return output.data;
}

// Helper to convert Float32Array to Buffer for DB storage
export function embeddingToBuffer(embedding: Float32Array): Buffer {
  return Buffer.from(embedding.buffer);
}

// Helper to convert Buffer from DB back to Float32Array
export function bufferToEmbedding(buffer: Buffer): Float32Array {
  return new Float32Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength / 4,
  );
}

// Cosine similarity for vector search
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
