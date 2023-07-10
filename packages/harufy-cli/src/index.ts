import { getContext } from "./actions/Context";
import { intro } from "./actions/intro";

const exit = () => process.exit(0);
process.on('SIGINT', exit);
process.on('SIGTERM', exit);

export async function main() {
    const cleanArgv = process.argv.slice(2).filter((arg) => arg !== '--');
    const ctx = await getContext(cleanArgv)
    const steps = [
        intro
    ]

    for(const step of steps) {
        await step(ctx)
    }
    process.exit(0)
}

export {
    getContext,
    intro
}