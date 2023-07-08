import { readFile } from 'fs/promises'
import path from 'path';

export const addJSExtensionPlugin = {
    name: 'harufy:add-js-extension',
    setup(build) {
        build.onLoad({ filter: /\.ts?$/},async (args) => {
            let retain = false; 
            if (args.path.endsWith('index.ts')) {
                retain = true;
            }
            const contents = await readFile(args.path, 'utf8');
            const updatedContents = addJSExtensionToImports(retain, args.path, contents);
            return {
                contents: updatedContents,
                loader: 'ts',
            }
        })
    }
}

function addJSExtensionToImports(retain, filePath, contents) {       
    const fileDir = path.dirname(filePath);
    const updatedContents = contents.replace(/(import\s.*?from\s*['"])(.+?)(['"])/g, (_, importStatement, importPath, quote) => {
        const updatedImportPath = isLocalImport(importPath) ? addJSExtensionToLocalImport(retain, fileDir, importPath) : importPath;
        return `${importStatement}${updatedImportPath}${quote}`;
    });
    return updatedContents;
}

function isLocalImport(importPath) {
    return importPath.startsWith('./') || importPath.startsWith('../') || importPath.startsWith('/');
}

function addJSExtensionToLocalImport(retain, fileDir, importPath) {
    const resolvedPath = path.resolve(fileDir, importPath);
    const withJSExtension = resolvedPath + '.js';
    if(retain) return `./${path.relative(fileDir, withJSExtension)}`;
    return path.relative(fileDir, withJSExtension);
}
