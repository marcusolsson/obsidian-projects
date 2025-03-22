const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const path = require('path');

const buildOptions = {
  entryPoints: ['./src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: ['vscode'], // Don't bundle vscode API
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  plugins: [
    copy({
      assets: [
        { from: ['./media/**/*'], to: './out/media' }
      ],
    }),
  ],
};

// Build script
async function build() {
  try {
    console.log('🔨 Building extension with esbuild...');
    await esbuild.build(buildOptions);
    console.log('✅ Build completed successfully!');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

// Watch script (for development)
async function watch() {
  try {
    console.log('👀 Watching for changes...');
    const ctx = await esbuild.context({
      ...buildOptions,
      sourcemap: true,
    });
    await ctx.watch();
    console.log('👀 esbuild is watching for changes');
  } catch (err) {
    console.error('❌ Watch failed:', err);
    process.exit(1);
  }
}

// Check if the script is called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch');
  
  if (watchMode) {
    watch();
  } else {
    build();
  }
}

module.exports = { build, watch };
