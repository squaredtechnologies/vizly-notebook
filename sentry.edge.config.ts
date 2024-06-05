// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://b46fc6f48a734af42b85bffb8f512d6a@o4504822958850048.ingest.sentry.io/4506628149805056",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	enabled: process.env.NODE_ENV !== "development",
});
