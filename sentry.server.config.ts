// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
