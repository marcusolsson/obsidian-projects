#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const extensionRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(extensionRoot, 'package.json');

console.log('Starting VSCode extension packaging process...');

// Ensure all dependencies are installed
console.log('\n📦 Checking dependencies...');
try {
  execSync('npm --version', { stdio: 'inherit' });
  console.log('✅ npm is installed');
} catch (error) {
  console.error('❌ npm is not available. Please install Node.js and npm');
  process.exit(1);
}

// Check if required dependencies are installed (both regular and dev)
const missingRegularDeps = [];
const missingDevDeps = [];
const requiredDevDeps = [
  '@vscode/vsce',
  'typescript',
  'eslint'
];

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const installedDevDeps = Object.keys(packageJson.devDependencies || {});
  const installedRegularDeps = Object.keys(packageJson.dependencies || {});
  const requiredRegularDeps = Object.keys(packageJson.dependencies || {});
  
  // Check dev dependencies
  for (const dep of requiredDevDeps) {
    if (!installedDevDeps.some(d => d === dep || d.startsWith(`${dep}@`))) {
      missingDevDeps.push(dep);
    }
  }
  
  // Check regular dependencies
  console.log('\n📋 Checking regular dependencies...');
  
  // Verify if node_modules exists and contains the expected dependencies
  // This is crucial because the vsce tool will check for installed dependencies
  // but won't install them automatically, leading to packaging failures
  for (const dep of requiredRegularDeps) {
    const depPath = path.join(extensionRoot, 'node_modules', dep);
    if (!fs.existsSync(depPath)) {
      console.log(`Missing dependency: ${dep}`);
      missingRegularDeps.push(dep);
    }
  }
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

// Install missing dev dependencies if needed
if (missingDevDeps.length > 0) {
  console.log(`Installing missing dev dependencies: ${missingDevDeps.join(', ')}...`);
  try {
    execSync(`npm install --save-dev ${missingDevDeps.join(' ')}`, { 
      stdio: 'inherit', 
      cwd: extensionRoot 
    });
    console.log('✅ Dev dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dev dependencies:', error.message);
    process.exit(1);
  }
}

// Install all regular dependencies if any are missing
if (missingRegularDeps.length > 0) {
  console.log(`Missing regular dependencies detected. Running full npm install...`);
  try {
    execSync(`npm install`, { 
      stdio: 'inherit', 
      cwd: extensionRoot 
    });
    console.log('✅ Regular dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install regular dependencies:', error.message);
    process.exit(1);
  }
}

// Verify assets
console.log('\n🖼️ Verifying extension assets...');
try {
  execSync('node ./scripts/verify-assets.js', { 
    stdio: 'inherit', 
    cwd: extensionRoot 
  });
  console.log('✅ Assets verified');
} catch (error) {
  console.error('❌ Asset verification failed:', error.message);
  process.exit(1);
}

// Compile TypeScript
console.log('\n🔨 Compiling TypeScript...');
try {
  execSync('npm run compile', { 
    stdio: 'inherit', 
    cwd: extensionRoot 
  });
  console.log('✅ Compilation complete');
} catch (error) {
  console.error('❌ Compilation failed:', error.message);
  process.exit(1);
}

// Double-check critical dependencies
console.log('\n🔍 Performing final dependency check...');
const criticalDeps = ['dayjs', 'fp-ts', 'gray-matter', 'immer', 'uuid'];
let allDepsFound = true;

for (const dep of criticalDeps) {
  const depPath = path.join(extensionRoot, 'node_modules', dep);
  if (!fs.existsSync(depPath)) {
    console.error(`❌ Critical dependency still missing: ${dep}`);
    allDepsFound = false;
  } else {
    console.log(`✅ Found ${dep}`);
  }
}

if (!allDepsFound) {
  console.log('\n⚠️ Some critical dependencies are still missing.');
  console.log('Running emergency npm install...');
  try {
    // Force a clean install
    execSync('npm ci', { 
      stdio: 'inherit', 
      cwd: extensionRoot 
    });
    console.log('✅ Dependencies reinstalled');
  } catch (error) {
    console.log('⚠️ npm ci failed, falling back to regular npm install...');
    try {
      execSync('npm install', { 
        stdio: 'inherit', 
        cwd: extensionRoot 
      });
      console.log('✅ Dependencies reinstalled');
    } catch (fallbackError) {
      console.error('❌ Failed to install dependencies even with fallback method');
      console.error('Please run "npm install" manually before packaging');
      process.exit(1);
    }
  }
}

// Ensure a clean build with esbuild
console.log('\n🔨 Building with esbuild...');
try {
  execSync('NODE_ENV=production node esbuild.js', { 
    stdio: 'inherit', 
    cwd: extensionRoot 
  });
  console.log('✅ esbuild build completed');
} catch (error) {
  console.error('❌ esbuild build failed:', error.message);
  process.exit(1);
}

// Package the extension
console.log('\n📦 Packaging extension...');
try {
  // Remove previous VSIX if it exists
  const vsixFiles = fs.readdirSync(extensionRoot)
    .filter(file => file.endsWith('.vsix'));
  
  vsixFiles.forEach(file => {
    const filePath = path.join(extensionRoot, file);
    console.log(`Removing previous package: ${file}`);
    fs.unlinkSync(filePath);
  });

  // Use vsce to package the extension
  execSync('npx @vscode/vsce package', { 
    stdio: 'inherit', 
    cwd: extensionRoot 
  });
  console.log('✅ Extension packaged successfully');
  
  // List the generated VSIX file
  const files = fs.readdirSync(extensionRoot)
    .filter(file => file.endsWith('.vsix'))
    .sort((a, b) => {
      return fs.statSync(path.join(extensionRoot, b)).mtime.getTime() - 
             fs.statSync(path.join(extensionRoot, a)).mtime.getTime();
    });
  
  if (files.length > 0) {
    console.log(`\n🎉 Generated extension package: ${files[0]}`);
    console.log(`\nYou can install this extension by running:`);
    console.log(`code --install-extension ${files[0]}`);
  }
} catch (error) {
  console.error('❌ Packaging failed:', error.message);
  console.log('\nCommon issues:');
  console.log('1. Missing publisher - Ensure "publisher" field is set in package.json');
  console.log('2. Invalid icon - Make sure icon.png exists and is a valid PNG file');
  console.log('3. Missing repository - Check "repository" field in package.json');
  process.exit(1);
}
