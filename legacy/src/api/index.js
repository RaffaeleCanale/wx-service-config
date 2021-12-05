import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { Router } from 'express';


function getModules() {
    const normalizedPath = path.join(__dirname, '.');
    const modules = [];

    fs.readdirSync(normalizedPath).forEach((key) => {
        if (key.endsWith('.js') && key !== 'index.js') {
            const file = path.join(__dirname, key);
            // eslint-disable-next-line
            modules.push(require(file).default);
        }
    });

    return modules;
}

function endpoint(router, routePath, ...routes) {
    for (let i = 0; i < routes.length - 1; i += 1) {
        router.use(routePath, routes[i]);
    }

    _.forEach(routes[routes.length - 1], (fn, key) => {
        router[key](routePath, fn);
    });
}


export default (state) => {
    const api = Router();
    const apiEndpoint = endpoint.bind(null, api);

    getModules().forEach(m => m(apiEndpoint, state));

    return api;
};
