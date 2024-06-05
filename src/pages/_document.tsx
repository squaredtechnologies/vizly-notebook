import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	const isProduction = process.env.NODE_ENV === "production";

	return (
		<Html lang="en" dir="ltr">
			<Head>
				{/* The require.js dependency required for some visualization embeds. */}
				<script src="/hecks/require.2.3.4.min.js" async />
				<script src="/hecks/plotly.js" async />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
