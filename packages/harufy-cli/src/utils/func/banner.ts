import color from 'chalk'
import { label } from '../messages/messages';
let stdout = process.stdout;


export const log = (message: string) => stdout.write(message + '\n');
export const banner = async (version: string) =>
	log(
		`\n${label('Harufy', color.black)}  ${color.green(
			color.bold(`v${version}`)
		)} ${color.bold('Cookies are baked!')}`
	);