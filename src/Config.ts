import Joi from 'joi';
import path from 'path';
import { readAndValidateFile } from '~/utils/FileUtils';
import { objSchema } from '~/utils/ValidationUtils';

export interface Config {
    port: number;
    bodyLimit: string;
    configDirectory: string;
}

const ConfigSchema = objSchema<Config>({
    port: Joi.number().required(),
    bodyLimit: Joi.string().default('100kb'),
    configDirectory: Joi.string().required(),
});

let config: Config | null = null;

export async function getConfig(): Promise<Config> {
    if (!config) {
        const configFile = path.join(__dirname, '../config.json');
        config = await readAndValidateFile(configFile, ConfigSchema);
    }
    return config;
}
