import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { isProd, env } from '../../env'
import { remember } from '@epic-web/remember'

const createPool = () => {
    return new Pool({
        connectionString: env.DATABASE_URL,
    })
}

let client;
if (isProd()) {
    client = createPool();
} else {
    // remember adds pool to global so we don't re-create more pools
    client = remember('dbPool', () => createPool());
}

export const db = drizzle({ client, schema });
export default db