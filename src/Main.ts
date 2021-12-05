import { Server } from '@canale/server';
import { getConfig } from '~/Config';
import { getRoutes } from '~/routes';

async function main() {
    const config = await getConfig();

    const server = new Server(
        {
            bodyLimit: config.bodyLimit,
            port: config.port,
            version: 2,
        },
        getRoutes(config),
    );

    server.start();
}

main().catch(console.error);
