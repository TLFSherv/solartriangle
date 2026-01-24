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

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique()
})

export const solarArrays = pgTable('solarArrays', {
    id: uuid('id').primaryKey().defaultRandom(),
    capacity: integer('capacity').notNull(),
    area: integer('area'),
    azimuth: integer('azimuth'),
    quantity: integer('quantity'),
    userId: uuid('user_id').references(() => users.id),
    addressId: uuid('address_id').references(() => addresses.id),
    dateCreated: timestamp('date_created').defaultNow(),
    lastModified: timestamp('last_modified').defaultNow(),
})

export const addresses = pgTable('addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    latitude: varchar('latitude', { length: 50 }).notNull(),
    longitude: varchar('longitude', { length: 50 }).notNull(),
    name: varchar('name', { length: 125 }).notNull()
})