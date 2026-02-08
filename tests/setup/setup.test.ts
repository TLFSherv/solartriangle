import { createTestUser, createTestSolarArray, cleanupDatabase } from "./dbHelpers";
import { describe, test, expect } from 'vitest'

describe('Test setup', () => {
    test('should connect to the test db', async () => {

        const { user } = await createTestUser();

        expect(user).toBeDefined();
        await cleanupDatabase()
    })
})