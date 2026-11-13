import { pgTable, uuid, varchar, text, timestamp, boolean, index, integer } from 'drizzle-orm/pg-core';

export const listings = pgTable('listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 40 }).notNull(),
  name: varchar('name', { length: 160 }).notNull(),
  contactName: varchar('contact_name', { length: 160 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }),
  category: text('category').notNull(),
  locality: varchar('locality', { length: 160 }).notNull(),
  address: text('address'),
  description: text('description').notNull(),
  availability: varchar('availability', { length: 160 }),
  imageUrl: text('image_url'),
  mapUrl: text('map_url'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  verified: boolean('verified').notNull().default(false),
  consent: boolean('consent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('listings_status_idx').on(t.status), index('listings_phone_idx').on(t.phone)]);

export const requests = pgTable('requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  kind: varchar('kind', { length: 30 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  name: varchar('name', { length: 160 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  locality: varchar('locality', { length: 160 }),
  mapUrl: text('map_url'),
  description: text('description').notNull(),
  photoData: text('photo_data'),
  photoMime: varchar('photo_mime', { length: 30 }),
  status: varchar('status', { length: 30 }).notNull().default('received'),
  privateToken: varchar('private_token', { length: 64 }).notNull(),
  consent: boolean('consent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('requests_kind_idx').on(t.kind)]);

export const contentEntries = pgTable('content_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 40 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body'),
  category: varchar('category', { length: 100 }),
  locality: varchar('locality', { length: 160 }),
  url: text('url'),
  imageUrl: text('image_url'),
  status: varchar('status', { length: 30 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('content_type_status_idx').on(t.type, t.status)]);

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  mimeType: varchar('mime_type', { length: 80 }).notNull(),
  fileName: varchar('file_name', { length: 255 }),
  sizeBytes: integer('size_bytes').notNull(),
  dataBase64: text('data_base64').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  nameMl: varchar('name_ml', { length: 160 }),
  profession: varchar('profession', { length: 160 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  qualification: varchar('qualification', { length: 200 }),
  locality: varchar('locality', { length: 160 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 255 }),
  bio: text('bio').notNull(),
  photoUrl: text('photo_url'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('professionals_status_idx').on(t.status)]);

export const formerCouncillors = pgTable('former_councillors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  nameMl: varchar('name_ml', { length: 160 }),
  yearSpan: varchar('year_span', { length: 60 }).notNull(),
  note: text('note'),
  photoUrl: text('photo_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const nearestPlaces = pgTable('nearest_places', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  town: varchar('town', { length: 100 }).notNull().default('Iritty'),
  category: varchar('category', { length: 100 }).notNull(),
  logoUrl: text('logo_url'),
  distanceNote: varchar('distance_note', { length: 160 }),
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  mapUrl: text('map_url'),
  websiteUrl: text('website_url'),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('nearest_status_idx').on(t.status)]);
