import readline from 'node:readline';
import { createLogUpdate } from 'log-update'
import { action } from '../prompts/action';
import { platform } from 'node:os';

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
    
}