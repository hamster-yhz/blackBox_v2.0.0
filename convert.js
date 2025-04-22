const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'public/images/blackbox-white.png',
  'public/images/blackbox-black.png'
];

async function convertToWebP() {
  for (const image of images) {
    try {
      if (!fs.existsSync(image)) {
        console.log(`File not found: ${image}`);
        continue;
      }

      const outputPath = image.replace('.png', '.webp');
      await sharp(image)
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`Converted ${image} to ${outputPath}`);
    } catch (error) {
      console.error(`Error converting ${image}:`, error);
    }
  }
}

convertToWebP().catch(console.error); 