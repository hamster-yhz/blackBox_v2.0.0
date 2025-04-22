import sharp from 'sharp';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const images = [
  // PNG images
  resolve(__dirname, 'public/images/blackbox-white.png'),
  resolve(__dirname, 'public/images/blackbox-black.png'),
  // JPEG images
  resolve(__dirname, 'public/images/hero-1.jpeg'),
  resolve(__dirname, 'public/images/hero-2.jpeg'),
  resolve(__dirname, 'public/images/hero-3.jpeg')
];

async function convertToWebP() {
  for (const image of images) {
    try {
      if (!existsSync(image)) {
        console.log(`File not found: ${image}`);
        continue;
      }

      const outputPath = image.replace(/\.(png|jpe?g)$/, '.webp');
      await sharp(image)
        .webp({ 
          quality: 85,
          effort: 6  // 增加压缩效果
        })
        .toFile(outputPath);
      console.log(`Converted ${image} to ${outputPath}`);
    } catch (error) {
      console.error(`Error converting ${image}:`, error);
    }
  }
}

convertToWebP().catch(console.error); 