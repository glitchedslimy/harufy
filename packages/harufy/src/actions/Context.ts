import arg from 'arg';
import detectPackageManager from 'which-pm-runs';
import { getName } from '../utils/func/getName';
import os from 'node:os';

export interface Context {
    help: boolean;
    cwd: string;
    pkgManager: string;
    username: string;
    version: string;
    skipHaru: boolean;
    dryRun?: boolean;
    yes?: boolean;
    projectName?: string;
    template?: string;
    ref: string;
    install?: boolean;
    git?: boolean;
    typescript?: string;
    stdin?: typeof process.stdin;
    stdout?: typeof process.stdout;
    exit(code: number): never;
}

export async function getContext(argv: string[]): Promise<Context> {
    const flags = arg({
        '--template': String,
        '--ref': String,
        '--yes': Boolean,
        '--no': Boolean,
        '--install': Boolean,
        '--no-install': Boolean,
        '--git': Boolean,
        '--no-git': Boolean,
        '--typescript': String,
        '--skip-haru': Boolean,
        '--dry-run': Boolean,
        '--help': Boolean,
        '--fancy': Boolean,

        '-y': '--yes',
        '-n': '--no',
        '-h': '--help',
    }, { argv, permissive: true });

    const pkgManager = detectPackageManager()?.name ?? 'npm';
    const [username] = await Promise.all([getName()]);
    let cwd = flags['_'][0];
    let {
		'--help': help = false,
		'--template': template,
		'--no': no,
		'--yes': yes,
		'--install': install,
		'--no-install': noInstall,
		'--git': git,
		'--no-git': noGit,
		'--typescript': typescript,
		'--fancy': fancy,
		'--skip-haru': skipHaru,
		'--dry-run': dryRun,
		'--ref': ref,
	} = flags;
    let projectName = cwd;
    if(no) {
        yes = false;
        if(install === undefined) install = false;
        if(git === undefined) git = false;
        if(typescript === undefined) typescript = 'strict';
    }

    skipHaru = ((os.platform() === 'win32' && !fancy) || skipHaru) ?? [yes, no, install, git, typescript].some((v) => v !== undefined);
    const context: Context = {
        help,
        version: '0.0.0',
        pkgManager,
        username,
        skipHaru,
        dryRun,
        projectName,
        template,
        ref: ref ?? 'latest',
        yes,
        install: install ?? (noInstall ? false : undefined),
        git: git ?? (noGit ? false : undefined),
        typescript,
        cwd,
        exit(code) {
            process.exit(code);
        }
    };
    return context;
}