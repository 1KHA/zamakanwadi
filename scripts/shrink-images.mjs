#!/usr/bin/env node
/**
 * Shrinks oversized images under public/ in place: caps pixel dimensions and
 * re-encodes at a sane quality. Safe to re-run — already-small images are
 * left untouched, and formats/extensions never change (so no code reference
 * ever needs to be updated).
 *
 * Usage:
 *   node scripts/shrink-images.mjs                 # shrink public/images
 *   node scripts/shrink-images.mjs public/images/x # shrink one subfolder
 *   node scripts/shrink-images.mjs --max-width 1200 # override the cap
 *   node scripts/shrink-images.mjs --dry-run        # report only, no writes
 *
 * Rule of thumb (see mdfiles/IMAGE_SHRINK.md): ~1920px for full-bleed hero
 * images, ~800px for cards/thumbnails, quality 75-80 for photos.
 */
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const widthFlagIndex = args.indexOf('--max-width');
const MAX_WIDTH = widthFlagIndex !== -1 ? Number(args[widthFlagIndex + 1]) : 1920;
const JPEG_QUALITY = 80;
const targets = args.filter((a) => !a.startsWith('--') && a !== String(MAX_WIDTH));
const roots = targets.length > 0 ? targets : ['public/images'];

// Skip anything already reasonably small — nothing to gain, and re-encoding
// a compressed file can occasionally make it slightly larger.
const MIN_BYTES_TO_PROCESS = 250 * 1024;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

function formatBytes(n) {
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function shrinkOne(path) {
  const before = (await stat(path)).size;
  if (before < MIN_BYTES_TO_PROCESS) return null;

  const ext = extname(path).toLowerCase();
  const image = sharp(path, { failOn: 'none' });
  const meta = await image.metadata();
  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  let pipeline = image.rotate(); // apply EXIF orientation, then drop it
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else {
    // PNG: keep lossless-format guarantees (transparency, sharp edges) but
    // still shrink dimensions and squeeze the compression harder.
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10 });
  }

  const buffer = await pipeline.toBuffer();
  if (buffer.length >= before) return null; // never make it worse

  if (!dryRun) {
    const tmp = `${path}.tmp`;
    await sharp(buffer).toFile(tmp);
    await unlink(path);
    await rename(tmp, path);
  }

  return { before, after: buffer.length, resized: needsResize };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for (const root of roots) {
    for await (const file of walk(root)) {
      const result = await shrinkOne(file);
      if (!result) continue;
      touched += 1;
      totalBefore += result.before;
      totalAfter += result.after;
      const pct = (100 * (1 - result.after / result.before)).toFixed(0);
      console.log(
        `${result.resized ? '↓resize+recompress' : '  recompress'}  ${file}  ` +
          `${formatBytes(result.before)} -> ${formatBytes(result.after)}  (-${pct}%)`
      );
    }
  }

  console.log(
    `\n${touched} file(s) ${dryRun ? 'would be' : ''} shrunk. ` +
      `${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} ` +
      `(saved ${formatBytes(totalBefore - totalAfter)}).`
  );
  if (dryRun) console.log('(dry run — no files were written)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
