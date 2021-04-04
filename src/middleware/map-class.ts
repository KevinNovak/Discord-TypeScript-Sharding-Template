import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export function mapClass(cls: ClassConstructor<unknown>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Map to class
        let object: any = plainToClass(cls, req.body);

        // Validate class
        let errors = await validate(object, { skipMissingProperties: false });
        if (errors.length > 0) {
            let errorItems = errors.map(error => ({
                property: error.property,
                constraints: error.constraints,
            }));
            res.status(400).send(errorItems);
            return;
        }

        // Set validated class to locals
        res.locals.input = object;
        next();
    };
}