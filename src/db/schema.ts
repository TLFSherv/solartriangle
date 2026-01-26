import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { string } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 75 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    dateCreated: timestamp('date_created').defaultNow(),
    lastModified: timestamp('last_modified').defaultNow(),
})

// when solar array is deleted auto delete polygon
export const solarArrays = pgTable('solarArrays', {
    id: uuid('id').primaryKey().defaultRandom(),
    capacity: integer('capacity').notNull(),
    quantity: integer('quantity'),
    userId: uuid('user_id').references(() => users.id),
    addressId: uuid('address_id').references(() => addresses.id),
    polygonId: uuid('polygon_id').references(() => polygons.id, { onDelete: 'cascade' }),
    dateCreated: timestamp('date_created').defaultNow(),
    lastModified: timestamp('last_modified').defaultNow(),
})

export const polygons = pgTable('polygons', {
    id: uuid('id').primaryKey().defaultRandom(),
    area: integer('area'),
    numberOfPoints: integer('number_of_points'),
    azimuth: integer('azimuth'),
    coords: text('coords').notNull(),
})

export const addresses = pgTable('addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    latitude: varchar('latitude', { length: 50 }).notNull(),
    longitude: varchar('longitude', { length: 50 }).notNull(),
    name: varchar('name', { length: 125 }).notNull()
})

export const userRelations = relations(users, ({ many }) => ({
    solarArrays: many(solarArrays)
}))

export const solarArrayRelations = relations(solarArrays,
    ({ one }) => ({
        users: one(users, {
            fields: [solarArrays.userId],
            references: [users.id]
        }),
        // create a one-sided relationship between solarArrays and polygons
        polygons: one(polygons, {
            fields: [solarArrays.polygonId],
            references: [polygons.id]
        }),
        addresses: one(addresses, {
            fields: [solarArrays.addressId],
            references: [addresses.id]
        })
    }))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type SolarArray = typeof solarArrays.$inferSelect
export type Polygon = typeof polygons.$inferSelect
export type Addresse = typeof addresses.$inferSelect

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)