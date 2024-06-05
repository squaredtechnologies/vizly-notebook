// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://b46fc6f48a734af42b85bffb8f512d6a@o4504822958850048.ingest.sentry.io/4506628149805056",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	replaysOnErrorSampleRate: 1.0,

	replaysSessionSampleRate: 0.0,

	// You can remove this option if you're not planning to use the Sentry Session Replay feature:
	integrations: [
		new Sentry.Replay({
			// Additional Replay configuration goes in here, for example:
			maskAllText: false,
			blockAllMedia: false,
		}),
	],

	enabled: process.env.NODE_ENV !== "development",
});
