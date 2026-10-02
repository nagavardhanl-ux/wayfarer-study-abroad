/**
 * next/image loader for the static export (no image server).
 * Serves files from /public as they are, under the base path. Remote images pass through.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export default function staticLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/")) return src;
  return `${BASE_PATH}${src}?w=${width}`;
}
