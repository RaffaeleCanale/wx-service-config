import Joi from 'joi';

export function validateBody(keys) {
    return (req, res, next) => Joi.validate(req.body, Joi.object().keys(keys).unknown())
        .then(() => next())
        .catch(err => res.status(400).send(err.message));
}

export function validateQuery(keys) {
    return (req, res, next) => Joi.validate(req.query, Joi.object().keys(keys).unknown())
        .then((query) => {
            req.query = query;
            return next();
        })
        .catch(err => res.status(400).send(err.message));
}
