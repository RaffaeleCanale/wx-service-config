import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Joi from 'joi';
import bodyParser from 'body-parser';
import Logger from 'js-utils/logger';

import initializeDb from 'db';
import middleware from 'middleware';
import api from 'api';

import fileConfig from '../config.json';

const configSchema = Joi.object().required().keys({
    server: Joi.object().required().keys({
        port: Joi.number().integer().default(8080),
        bodyLimit: Joi.string().default('100kb'),
        corsHeaders: Joi.array().default(['Link']),
    }),
    auth: Joi.object().optional().keys({
        password: Joi.string().required(),
        secret: Joi.string().required(),
        jwtExpiry: Joi.string().allow('').default('1h'),
    }),
});

if (process.argv.indexOf('--help') >= 0) {
    console.log(`
    Usage:
    npm run start
    `);
    process.exit(0);
}

const { error, value } = Joi.validate(fileConfig, configSchema);
if (error) {
    Logger.error(error);
    process.exit(1);
}
const config = value;

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.server.corsHeaders,
}));

app.use(bodyParser.json({ limit: config.server.bodyLimit }));

// connect to db
initializeDb((db) => {

    // internal middleware
    app.use(middleware({ config, db }));

    // api router
    app.use('/api', api({ config, db }));

    app.server.listen(process.env.PORT || config.server.port, () => {
        Logger.info(`Started on port ${app.server.address().port}`);
    });
});

export default app;
