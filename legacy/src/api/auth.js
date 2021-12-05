import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { getLogger } from 'js-utils/logger';
import * as paths from 'utils/paths';

import { validateBody } from 'middleware/validator';

const logger = getLogger('auth');
const loginSchema = {
    hash: Joi.string().required(),
    domains: Joi.array().required().items(Joi.string().required()),
};

function generateToken(config, domains) {
    const { secret, jwtExpiry } = config.auth;
    const options = {};
    if (jwtExpiry && jwtExpiry !== '') {
        options.expiresIn = jwtExpiry;
    }
    return jwt.sign({
        data: { domains },
    }, secret, options);
}

export default (route, { config }) => {
    if (!config.auth) {
        return;
    }

    route('/login/token', {
        post: [
            validateBody(loginSchema),
            function post({ body }, res) {
                for (let i = 0; i < body.domains.length; i += 1) {
                    const domain = body.domains[i];
                    if (!paths.isValidDomain(domain)) {
                        return res.status(400).send(`Invalid domain: ${domain}`);
                    }
                }

                return bcrypt.compare(config.auth.password, body.hash)
                    .then((matches) => {
                        if (matches) {
                            return res.json({
                                token: generateToken(config, body.domains),
                            });
                        }
                        return res.status(401).send('Wrong password');
                    })
                    .catch((err) => {
                        logger.error(err);
                        return res.status(500).send(err);
                    });
            },
        ],
    });
};
