import { Request, RoutesBuilder, SendFile } from '@canale/server';
import { NotFound, ValidationError } from '@canale/server/lib/Errors';
import { Files } from '~/resources/Files';

const USER_HEADER_NAME = 'user';

function getUser(request: Request): string {
    const user = request.headers[USER_HEADER_NAME];
    if (!user) {
        throw new ValidationError('User header not found');
    }
    return user;
}

export default function buildGetFileRoute(
    routes: RoutesBuilder,
    files: Files,
): void {
    routes.route('/project/:project/file/:fileName').endpoints({
        async get(request: Request): Promise<SendFile> {
            const { project, fileName } = request.params;
            const user = getUser(request);

            const file = await files.getFilePath(user, project, fileName);
            if (!file) {
                throw new NotFound(
                    `File not found: ${user}/${project}/${fileName}`,
                );
            }
            return new SendFile(file, { dotfiles: 'allow' });
        },
    });
}
