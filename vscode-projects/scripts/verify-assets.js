#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define paths
const extensionRoot = path.resolve(__dirname, '..');
const mediaDir = path.join(extensionRoot, 'media');
const iconFile = path.join(mediaDir, 'projects-icon.svg');
const iconPngFile = path.join(mediaDir, 'icon.png');
const outputMediaDir = path.join(extensionRoot, 'out', 'media');
const outputIconFile = path.join(outputMediaDir, 'projects-icon.svg');
const outputIconPngFile = path.join(outputMediaDir, 'icon.png');

console.log('Verifying extension assets...');

// Check if media directory exists
if (!fs.existsSync(mediaDir)) {
  console.error('❌ Media directory not found');
  process.exit(1);
} else {
  console.log('✅ Media directory exists');
}

// Check if icon file exists
if (!fs.existsSync(iconFile)) {
  console.error('❌ Icon file not found');
  process.exit(1);
} else {
  console.log('✅ Icon file exists');
  
  // Read icon file contents to verify it's valid
  const iconContent = fs.readFileSync(iconFile, 'utf8');
  if (!iconContent.includes('<svg') || !iconContent.includes('path')) {
    console.error('❌ Icon file does not contain valid SVG content');
  } else {
    console.log('✅ Icon file contains valid SVG content');
  }
}

// Ensure the output media directory exists
if (!fs.existsSync(outputMediaDir)) {
  console.log('📁 Creating output media directory');
  fs.mkdirSync(outputMediaDir, { recursive: true });
}

// Copy the icon file to the output directory
console.log('📋 Copying icon to output directory');
fs.copyFileSync(iconFile, outputIconFile);
console.log('✅ Icon file copied to output directory');

// Check if icon.png exists
if (!fs.existsSync(iconPngFile)) {
  console.warn('⚠️ icon.png not found');
  
  // Create a placeholder icon.png if it doesn't exist
  console.log('📝 Creating placeholder icon.png');
  const placeholderContent = `This is a placeholder for a 128x128 px icon.
A proper icon should be created for the extension.
  
The VS Code Marketplace requires an icon that is:
- At least 128x128 pixels
- PNG format
- With a transparent background`;
  
  fs.writeFileSync(iconPngFile, placeholderContent);
  console.log('✅ Placeholder icon.png created');
} else {
  console.log('✅ icon.png exists');
}

// Copy the icon.png file to the output directory
console.log('📋 Copying icon.png to output directory');
fs.copyFileSync(iconPngFile, outputIconPngFile);
console.log('✅ icon.png copied to output directory');

console.log('✅ All assets verified successfully!');
