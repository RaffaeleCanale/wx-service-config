import { Route, RoutesBuilder } from '@canale/server';
import { Config } from '~/Config';
import { getFilesResource } from '~/resources/Files';
import buildGetFileRoute from '~/routes/GetFile';

export function getRoutes(config: Config): Route[] {
    const filesResource = getFilesResource(config);

    const routes = new RoutesBuilder();

    buildGetFileRoute(routes, filesResource);

    return routes.build();
}
