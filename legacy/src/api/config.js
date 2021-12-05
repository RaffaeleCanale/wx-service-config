import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import * as paths from 'utils/paths';
// import { getLogger } from 'js-utils/logger';
import * as files from 'utils/files';

import { validateQuery, validateBody } from 'middleware/validator';


function getExistingFile(parent, name, domain, version) {
    const file = version === undefined
        ? paths.getFile(parent, name, domain)
        : paths.getBackupFile(parent, name, domain, version);
    if (fs.existsSync(file)) {
        return file;
    }
    return null;
}

function findFile(parent, name, domains, version) {
    for (let i = 0; i < domains.length; i += 1) {
        const file = getExistingFile(parent, name, domains[i], version);
        if (file) {
            return file;
        }
    }

    return null;
}

function backupFile(parent, name, domain) {
    const original = paths.getFile(parent, name, domain);
    let version = 0;
    let backup = paths.getBackupFile(parent, name, domain, version);
    while (fs.existsSync(backup)) {
        version += 1;
        backup = paths.getBackupFile(parent, name, domain, version);
    }

    fs.copyFileSync(original, backup);
}

function getAllVersions(parent, name, domain) {
    const result = [];

    const original = paths.getFile(parent, name, domain);
    if (fs.existsSync(original)) {
        result.push(original);
    }

    let version = 0;
    let backup = paths.getBackupFile(parent, name, domain, version);
    while (fs.existsSync(backup)) {
        result.push(backup);
        version += 1;
        backup = paths.getBackupFile(parent, name, domain, version);
    }

    return result;
}

export default (route) => {

    route('/config', {
        get: [
            validateQuery({
                file: Joi.string().required(),
                path: Joi.string().default('./'),
                domain: Joi.string().optional(),
                version: Joi.string().optional(),
            }),
            function get({ query, user }, res) {
                let file;
                if (query.domain) {
                    if (!user.data.domains.includes(query.domain)) {
                        return res.status(403).send();
                    }
                    file = getExistingFile(query.path, query.file, query.domain, query.version);
                } else {
                    file = findFile(query.path, query.file, user.data.domains, query.version);
                }
                if (!file) {
                    return res.status(404).send();
                }

                const content = files.readFile(file);
                return res.send({ content, file });
            },
        ],

        post: [
            validateBody({
                file: Joi.string().required(),
                path: Joi.string().default('./'),
                content: Joi.string().required(),
                domain: Joi.string().required(),
            }),
            function post({ body, user }, res) {
                if (!user.data.domains.includes(body.domain)) {
                    return res.status(403).send();
                }

                const file = paths.getFile(body.path, body.file, body.domain);
                if (fs.existsSync(file)) {
                    backupFile(body.path, body.file, body.domain);
                }

                files.writeFile(file, body.content);
                return res.send({ file });
            },
        ],
    });

    route('/config/versions', {
        get: [
            validateQuery({
                file: Joi.string().required(),
                path: Joi.string().default('./'),
                domain: Joi.string().optional(),
            }),
            function get({ query, user }, res) {
                const result = {};

                if (query.domain) {
                    if (!user.data.domains.includes(query.domain)) {
                        return res.status(403).send();
                    }
                } else {
                    user.data.domains.forEach((domain) => {
                        result[domain] = getAllVersions(query.path, query.file, domain);
                    });
                }

                return res.send(result);
            },
        ],

    });
};
