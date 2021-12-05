import fs from 'fs';
import { ObjectSchema } from 'joi';
import util from 'util';
import { validate } from '~/utils/ValidationUtils';

export function writeFile(filePath: string, data: string): Promise<void> {
    return util.promisify(fs.writeFile)(filePath, data);
}

export async function readJsonFile(file: string): Promise<unknown> {
    if (!fs.existsSync(file)) {
        return Promise.reject(new Error(`File ${file} does not exist`));
    }

    const data = await util.promisify(fs.readFile)(file, 'utf8');
    return JSON.parse(data);
}

export async function readAndValidateFile<T>(
    file: string,
    schema: ObjectSchema<T>,
): Promise<T> {
    const json = await readJsonFile(file);
    return validate(json, schema, file);
}

export async function fileExists(filePath: string): Promise<boolean> {
    return util.promisify(fs.exists)(filePath);
}
