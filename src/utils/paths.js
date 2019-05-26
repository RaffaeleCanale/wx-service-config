import path from 'path';

// TODO Use config for this stuff
const ROOT = './public';

export function getFile(parent, name, domain) {
    return path.join(
        ROOT,
        parent,
        `${domain}.${name}`
    );
}

export function getBackupFile(parent, name, domain, version) {
    return path.join(
        ROOT,
        parent,
        `.v${version}.${domain}.${name}`
    );
}

export function isValidDomain(domain) {
    return domain && domain !== '' && !domain.includes('.');
}
