import { exec } from "node:child_process"

export const getName = () =>
	new Promise<string>((resolve) => {
		exec('git config user.name', { encoding: 'utf-8' }, (_1, gitName) => {
			if (gitName.trim()) {
				return resolve(gitName.split(' ')[0].trim());
			}
			exec('whoami', { encoding: 'utf-8' }, (_3, whoami) => {
				if (whoami.trim()) {
					return resolve(whoami.split(' ')[0].trim());
				}
				return resolve('fella');
			});
		});
	});
