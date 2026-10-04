import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function run() {
  console.log('Generating PNG icons for Android and iOS...');
  
  // 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Generated public/pwa-192x192.png');

  // 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Generated public/pwa-512x512.png');

  // 512x512 maskable icon with 10% safe zone padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 27, g: 15, b: 3, alpha: 1 }, // #1B0F03
    })
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Generated public/pwa-maskable-512x512.png');

  // 180x180 Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // Favicon 64x64
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('Generated public/favicon.ico');

  console.log('All icons generated successfully!');
}

run().catch(console.error);
