import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import glob from 'tiny-glob';
import { defaultEsBuildConfig } from '../config/esbuild/defaultConfig.js';
import {addJSExtensionPlugin, rebuildPlugin, clean } from '../utils/index.js'


export default async function build(...args) {
	const config = Object.assign({}, defaultEsBuildConfig);
	const isDev = args.slice(-1)[0] === 'IS_DEV';
	const patterns = args
		.filter((f) => !!f) // remove empty args
		.map((f) => f.replace(/^'/, '').replace(/'$/, '')); // Needed for Windows: glob strings contain surrounding string chars??? remove these
	let entryPoints = [].concat(
		...(await Promise.all(
			patterns.map((pattern) => glob(pattern, { filesOnly: true, absolute: true }))
		))
	);

	const noClean = args.includes('--no-clean-dist');
	const forceCJS = args.includes('--force-cjs');

	const {
		type = 'module',
		version
	} = await fs.readFile('./package.json').then((res) => JSON.parse(res.toString()));
	// expose PACKAGE_VERSION on process.env for CLI utils
	config.define = { 'process.env.PACKAGE_VERSION': JSON.stringify(version) };
	const format = type === 'module' && !forceCJS ? 'esm' : 'cjs';

	const outdir = 'dist';

	if (!noClean) {
		await clean(outdir);
	}

	if (!isDev) {
		await esbuild.build({
			...config,
			splitting: true,
			entryPoints,
			outdir,
			outExtension: forceCJS ? { '.js': '.cjs' } : {},
			format,
			plugins: [
				addJSExtensionPlugin
			]
		});
		return;
	}

	const builder = await esbuild.context({
		...config,
		entryPoints,
		outdir,
		format,
		splitting: true,
		plugins: [
			addJSExtensionPlugin,
			rebuildPlugin({ isDev, args })
		],
	});

	await builder.watch();

	process.on('beforeExit', () => {
		builder.stop && builder.stop();
	});
}