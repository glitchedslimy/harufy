import readline from 'node:readline';
import { createLogUpdate } from 'log-update'
import { action } from '../prompts/action';
import { platform } from 'node:os';
import color from 'chalk'
import { random, randomBetween } from '../func/random';
import { sleep } from '../func/sleep';

const unicode = { enabled: platform() !== 'win32' };
const useAscii = () => !unicode.enabled;

export const say = async (messages: string | string[] = [], {clear = false, hat = '', stdin = process.stdin, stdout = process.stdout} = {}) => {
    const rl = readline.createInterface({input: stdin, escapeCodeTimeout: 50});
    const logUpdate = createLogUpdate(stdout, { showCursor: false });
    readline.emitKeypressEvents(stdin, rl);

    let i = 0;
    let cancelled = false;
    const done = async () => {
        stdin.off('keypress', done);
        if(stdin.isTTY) stdin.setRawMode(false);
        rl.close();
        cancelled = true;
        if(i < messages.length - 1) {
            logUpdate.clear();
        } else if (clear) {
            logUpdate.clear();
        } else {
            logUpdate.done();
        }
    }

    if(stdin.isTTY) stdin.setRawMode(true);
    stdin.on('keypress', (str, key) => {
        if(stdin.isTTY) stdin.setRawMode(true);
        const k = action(key, true);
        if(k === 'abort') {
            done();
            return process.exit(0);
        }
        if(['up', 'down', 'left', 'right'].includes(k as any)) return;
        done();
    });

    const _messages = Array.isArray(messages) ? messages : [messages];
    const eyes = useAscii() ? ['•', '•', 'o', 'o', '•', 'O', '^', '•'] : ['●', '●', '●', '●', '●', '○', '○', '•'];
    const mouths = useAscii() ? ['•', 'O', '*', 'o', 'o', '•', '-'] : ['•', '○', '■', '▪', '▫', '▬', '▭', '-', '○'];
    const ears = ['(\\_', '_/)']
    const body = ['/ >', '<\\'];
    const cookie = ['●']

    const haru = (msg: string, { mouth = mouths[0], eye = eyes[0]} = {}) => {
        return [
            `${color.magenta(ears[0])}${color.magenta(ears[1])} ${color.bold(`${color.magenta('Haru')}`)}`,
            `${color.magenta('(')} ${color.blue(eye)}${color.red(mouth)}${color.blue(eye)}${color.magenta(')')} ${msg}`,
            `${color.magenta(body[0])}${color.hex('#C7A317')(cookie)}${color.magenta(body[1])}`
        ].join('\n');
    }

    for(const message of _messages) {
        const _message = Array.isArray(message) ? message : message.split(' ');
        let msg = [];
        let eye = random(eyes);
        let j = 0;
        for (const word of [''].concat(_message)) {
            if(word) msg.push(word);
            const mouth = random(mouths);
            if(j % 7 === 0) eye = random(eyes);
            if(i == 1) eye = eye;
            logUpdate('\n' + haru(msg.join(' '), { mouth, eye }));
            if(!cancelled) await sleep(randomBetween(75, 200));
            j++;
        }
        if(!cancelled) await sleep(100);
        const text = '\n' + haru(_message.join(' '), { mouth: useAscii() ? 'u' : '◡', eye: useAscii() ? '^' : '◠' });
        logUpdate(text);
        if(!cancelled) await sleep(randomBetween(1200, 1400));
        i++;
    }

    stdin.off('keypress', done);
    await sleep(100);
    done();
    if(stdin.isTTY) stdin.setRawMode(false);
    stdin.removeAllListeners('keypress');
}

export const label = (text: string, c = color.bgMagenta, t = color.whiteBright) => c(` ${t(text)}`);