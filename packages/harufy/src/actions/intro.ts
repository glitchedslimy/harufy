import { random } from "../utils/func/random";
import { label, say } from "../utils/messages/messages";
import type { Context } from "./Context";
import color from 'chalk'
import { welcome } from "../utils/func/welcome";
import { banner } from "../utils/func/banner";

export async function intro(ctx: Pick<Context, 'skipHaru' | 'version' | 'username'>) { 
    if(!ctx.skipHaru) {
        await say([
			[
				'Welcome',
				'to',
				label('Harufy', color.bgGreen, color.black),
				color.green(`v${ctx.version}`) + ',',
				`${ctx.username}!`,
			],
			random(welcome),
		]);
        await banner(ctx.version)
    } else {
        await banner(ctx.version);
    }
}