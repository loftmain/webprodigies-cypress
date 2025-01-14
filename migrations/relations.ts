import { relations } from "drizzle-orm/relations";
import { workspace, folder, files, usersInAuth, users, customers, products, prices, subscriptions } from "./schema";

export const folderRelations = relations(folder, ({one, many}) => ({
	workspace: one(workspace, {
		fields: [folder.workspaceId],
		references: [workspace.id]
	}),
	files: many(files),
}));

export const workspaceRelations = relations(workspace, ({many}) => ({
	folders: many(folder),
	files: many(files),
}));

export const filesRelations = relations(files, ({one}) => ({
	folder: one(folder, {
		fields: [files.folderId],
		references: [folder.id]
	}),
	workspace: one(workspace, {
		fields: [files.workspaceId],
		references: [workspace.id]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
	customers: many(customers),
	subscriptions: many(subscriptions),
}));

export const customersRelations = relations(customers, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [customers.id],
		references: [usersInAuth.id]
	}),
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
	usersInAuth: one(usersInAuth, {
		fields: [subscriptions.userId],
		references: [usersInAuth.id]
	}),
}));