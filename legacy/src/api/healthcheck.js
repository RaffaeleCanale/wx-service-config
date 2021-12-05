import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import * as paths from 'utils/paths';
// import { getLogger } from 'js-utils/logger';

import { validateQuery, validateBody } from 'middleware/validator';

export default (route, { config }) => {

    route('/healthcheck', {
        get(params, res) {
            const root = paths.getRoot();

            let response = { healthy: true };
            if (!fs.existsSync(root)) {
                response = {
                    healthy: false,
                    message: 'Root directory does not exist',
                };
            } else if (fs.readdirSync(root).length === 0) {
                response = {
                    healthy: false,
                    message: 'Root directory is empty',
                };
            }

            return res.status(200).send(response);
        },
    });
};
