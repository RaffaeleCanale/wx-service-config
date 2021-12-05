import path from 'path';
import fs from 'fs';
import forEach from 'lodash/forEach';
import { ROOT } from './paths';

let constants = {};

const constantsFile = path.join(ROOT, 'properties.json');
if (fs.existsSync(constantsFile)) {
    constants = JSON.parse(fs.readFileSync(constantsFile, 'utf8'));
}

function replaceAll(string, oldValue, newValue) {
    return string.split(oldValue).join(newValue);
}

export function readFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    forEach(constants, (value, name) => {
        content = replaceAll(content, name, value);
    });
    return content;
}

export function writeFile(file, content) {
    forEach(constants, (value, name) => {
        content = replaceAll(content, value, name);
    });

    fs.writeFileSync(file, content, 'utf8');
}
