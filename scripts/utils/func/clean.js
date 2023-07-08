import { deleteAsync } from 'del';
export async function clean(outdir) {
	await deleteAsync([`${outdir}/**`, `!${outdir}/**/*.d.ts`], {
		onlyFiles: true,
	});
}