import { relations } from "drizzle-orm/relations";
import { folders, files, workspaces, users, customers, products, prices, subscriptions } from "./schema";

export const filesRelations = relations(files, ({one}) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id]
	}),
	workspace: one(workspaces, {
		fields: [files.workspaceId],
		references: [workspaces.id]
	}),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	files: many(files),
	workspace: one(workspaces, {
		fields: [folders.workspaceId],
		references: [workspaces.id]
	}),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	files: many(files),
	folders: many(folders),
}));

export const customersRelations = relations(customers, ({one}) => ({
	user: one(users, {
		fields: [customers.id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	customers: many(customers),
	user: one(users, {
		fields: [users.id],
		references: [users.id],
		relationName: "users_id_users_id"
	}),
	users: many(users, {
		relationName: "users_id_users_id"
	}),
	subscriptions: many(subscriptions),
}));

export const pricesRelations = relations(prices, ({one, many}) => ({
	product: one(products, {
		fields: [prices.productId],
		references: [products.id]
	}),
	subscriptions: many(subscriptions),
}));

export const productsRelations = relations(products, ({many}) => ({
	prices: many(prices),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	price: one(prices, {
		fields: [subscriptions.priceId],
		references: [prices.id]
	}),
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
}));