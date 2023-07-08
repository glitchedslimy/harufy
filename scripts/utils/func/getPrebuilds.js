export function getPrebuilds(isDev, args) {
	let prebuilds = [];
	while (args.includes('--prebuild')) {
		let idx = args.indexOf('--prebuild');
		prebuilds.push(args[idx + 1]);
		args.splice(idx, 2);
	}
	if (prebuilds.length && isDev) {
		prebuilds.unshift('--no-minify');
	}
	return prebuilds;
}
