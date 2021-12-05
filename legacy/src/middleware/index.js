import { Router } from 'express';
import jwt from 'express-jwt';
import unless from 'express-unless';

function exceptPath(middleware, paths) {
    middleware.unless = unless; // eslint-disable-line
    return middleware.unless({ path: paths });
}

export default ({ config }) => {
    const routes = Router();

    if (config.auth) {
        const auth = jwt({
            secret: config.auth.secret,
            getToken: function getToken(req) {
                const header = req.headers['x-wx-authorization'] || req.headers.authorization;
                if (header && header.split(' ')[0] === 'Bearer') {
                    return header.split(' ')[1];
                }
                return null;
            },
        });
        routes.use(exceptPath(auth, ['/api/login/token', '/api/healthcheck']));
    }

    return routes;
};
