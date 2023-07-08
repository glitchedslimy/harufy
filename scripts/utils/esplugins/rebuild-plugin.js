import { dim, green, red, yellow } from 'kleur/colors';
import prebuild from '../../cmd/prebuild.js';
import { getPrebuilds } from '../index.js'

export const rebuildPlugin = ({isDev, args}) => {
    return {
    name: 'harufy:rebuild',
    setup(build) {
        const dt = new Intl.DateTimeFormat('en-us', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const prebuilds = getPrebuilds(isDev, args);
        build.onEnd(async (result) => {
            if (prebuilds.length) {
                await prebuild(...prebuilds);
            }
            const date = dt.format(new Date());
            if (result && result.errors.length) {
                console.error(dim(`[${date}] `) + red(error || result.errors.join('\n')));
            } else {
                if (result.warnings.length) {
                    console.log(
                        dim(`[${date}] `) + yellow('⚠️ updated with warnings:\n' + result.warnings.join('\n'))
                    );
                }
                console.log(dim(`[${date}] `) + green('👌 updated'));
            }
        });
    }
}
};