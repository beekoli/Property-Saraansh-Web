/**
 * AI news cover generator — Google Gemini "Nano Banana" image model.
 *
 *   node gen-cover.js <output.png> "<detailed image prompt>"
 *
 * Saves a 1280x720 PNG (centre-cropped to 16:9). Needs GEMINI_API_KEY in .env
 * (free key from https://aistudio.google.com → Get API key). Optional
 * GEMINI_IMAGE_MODEL overrides the model name.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [outArg, ...promptParts] = process.argv.slice(2);
const prompt = promptParts.join(' ').trim();
if (!outArg || !prompt) {
  console.error('Usage: node gen-cover.js <output.png> "<image prompt>"');
  process.exit(1);
}
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY is missing in .env (get one free at https://aistudio.google.com).');
  process.exit(1);
}
const MODELS = process.env.GEMINI_IMAGE_MODEL
  ? [process.env.GEMINI_IMAGE_MODEL]
  : ['gemini-2.5-flash-image', 'gemini-2.5-flash-image-preview'];

const fullPrompt =
  `${prompt}\n\nWide landscape 16:9 composition, photorealistic news photograph, natural light. ` +
  `Absolutely no text, words, signage, watermarks or logos anywhere in the image.`;

async function generate(model) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${model} → HTTP ${res.status}: ${json?.error?.message || res.statusText}`);
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
  if (!img) {
    const reason = json?.candidates?.[0]?.finishReason || json?.promptFeedback?.blockReason || 'no image returned';
    throw new Error(`${model} → ${reason}`);
  }
  return Buffer.from((img.inlineData || img.inline_data).data, 'base64');
}

let buf, lastErr;
for (const m of MODELS) {
  try { buf = await generate(m); console.log(`· generated with ${m}`); break; }
  catch (e) { lastErr = e; console.warn('· ' + e.message.slice(0, 300)); if (!/not found|404/i.test(e.message)) break; }
}
if (!buf) { console.error('✗ Image generation failed: ' + (lastErr?.message || 'unknown')); process.exit(2); }

// Centre-crop to 16:9 and scale to 1280x720.
const src = await loadImage(buf);
const W = 1280, H = 720, target = W / H;
let sw = src.width, sh = src.height, sx = 0, sy = 0;
if (sw / sh > target) { sw = Math.round(sh * target); sx = Math.round((src.width - sw) / 2); }
else { sh = Math.round(sw / target); sy = Math.round((src.height - sh) / 2); }
const canvas = createCanvas(W, H);
canvas.getContext('2d').drawImage(src, sx, sy, sw, sh, 0, 0, W, H);
const out = path.isAbsolute(outArg) ? outArg : path.join(__dirname, outArg);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log(`✓ saved ${out} (${W}x${H}, from ${src.width}x${src.height})`);
