import { imageManifest } from "@/generated/image-manifest";

const supportedExtensions = ["webp", "png", "jpg", "jpeg", "avif"];

export function normalizeDisplayName(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findMemberImage(id: string, displayName: string, files: readonly string[] = imageManifest) {
  const candidates = [id, normalizeDisplayName(displayName)];
  for (const candidate of candidates) {
    for (const extension of supportedExtensions) {
      const filename = `${candidate}.${extension}`;
      if (files.includes(filename)) return filename;
    }
  }
  return "default.svg";
}
