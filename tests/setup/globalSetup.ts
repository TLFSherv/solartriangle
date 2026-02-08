import { db } from '../../src/db/connection'
import { users, addresses, polygons, solarArrays } from '../../src/db/schema'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'

export default async function setup() {
    console.log('💾 Setting up test database...');
    try {
        await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
        await db.execute(sql`DROP TABLE IF EXISTS ${addresses} CASCADE`)
        await db.execute(sql`DROP TABLE IF EXISTS ${polygons} CASCADE`)
        await db.execute(sql`DROP TABLE IF EXISTS ${solarArrays} CASCADE`)

        console.log('🚀 Pushing schema using drizzle...')
        execSync(
            `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
            { stdio: 'inherit', cwd: process.cwd() }
        )
        console.log('✅ Test database setup complete.');
    } catch (e) {
        console.error('❌ Failed to setup test db', e);
        throw e;
    }

}