import path from 'path';
import { Config } from '~/Config';
import { fileExists } from '~/utils/FileUtils';

export interface Files {
    getFilePath(
        user: string,
        project: string,
        fileName: string,
    ): Promise<string | null>;
}

export function getFilesResource(config: Config): Files {
    return {
        async getFilePath(user, project, fileName) {
            const filePath = path.join(
                config.configDirectory,
                user.toLowerCase(),
                project,
                fileName,
            );

            if (await fileExists(filePath)) {
                return filePath;
            }
            return null;
        },
    };
}
