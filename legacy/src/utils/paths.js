import path from 'path';
import fs from 'fs';
// TODO Use config for this stuff
export const ROOT = './public';

let aliases = {};

export function getFile(parent, name, domain) {
    if (aliases[parent]) {
        parent = aliases[parent];
    }
    return path.join(
        ROOT,
        parent,
        `${domain}.${name}`
    );
}

export function getBackupFile(parent, name, domain, version) {
    if (aliases[parent]) {
        parent = aliases[parent];
    }
    return path.join(
        ROOT,
        parent,
        `.${domain}.${name}.v${version}`
    );
}

export function isValidDomain(domain) {
    return domain && domain !== '' && !domain.includes('.');
}

export function getRoot() {
    return ROOT;
}

const aliasesConfig = path.join(ROOT, 'aliases.json');
if (fs.existsSync(aliasesConfig)) {
    aliases = JSON.parse(fs.readFileSync(aliasesConfig, 'utf8'));
}
