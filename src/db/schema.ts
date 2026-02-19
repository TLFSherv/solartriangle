import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    char,
    integer,
    numeric
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
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
    name: varchar('name', { length: 24 }).notNull(),
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
    area: varchar('area', { length: 12 }),
    numberOfPoints: integer('number_of_points'),
    azimuth: varchar('azimuth', { length: 12 }),
    coords: text('coords').notNull(),
})

export const addresses = pgTable('addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    countryCode: char('countryCode', { length: 2 }).notNull(),
    latitude: varchar('latitude', { length: 50 }).notNull(),
    longitude: varchar('longitude', { length: 50 }).notNull(),
    name: varchar('name', { length: 125 }).notNull().unique()
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
export type NewSolarArray = typeof solarArrays.$inferInsert
export type Polygon = typeof polygons.$inferSelect
export type NewPolygon = typeof polygons.$inferInsert
export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertSolarArraySchema = createInsertSchema(solarArrays)
export const insertPolygonSchema = createInsertSchema(polygons)
export const insertAddressSchema = createInsertSchema(addresses)