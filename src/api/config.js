import Joi from 'joi';
import fs from 'fs';
import path from 'path';
// import { getLogger } from 'js-utils/logger';

import { validateQuery } from 'middleware/validator';
//
// const logger = getLogger('auth');
const schema = {
    file: Joi.string().required(),
    path: Joi.string().default('./'),
};

function isValidDomain(domain) {
    return domain && domain !== '' && !domain.includes('.');
}

function findFile(parent, name, domains) {
    for (let i = 0; i < domains.length; i += 1) {
        const file = path.join('./public', parent, `${domains[i]}.${name}`);
        if (isValidDomain(domains[i]) && fs.existsSync(file)) {
            return file;
        }
    }

    return null;
}

export default (route) => {

    route('/config', {
        get: [
            validateQuery(schema),
            function get({ query, user }, res) {
                const file = findFile(query.path, query.file, user.data.domains);
                if (!file) {
                    return res.status(404).send();
                }
                return res.download(file, query.file);
            },
        ],
    });
};
