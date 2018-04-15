import { Router } from 'express';
import jwt from 'express-jwt';
import unless from 'express-unless';

function exceptPath(middleware, path) {
    middleware.unless = unless; // eslint-disable-line
    return middleware.unless({ path: [path] });
}

export default ({ config }) => {
    const routes = Router();

    if (config.auth) {
        const auth = jwt({ secret: config.auth.secret });
        routes.use(exceptPath(auth, '/api/login/token'));
    }

    return routes;
};
