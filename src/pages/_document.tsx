import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	const isProduction = process.env.NODE_ENV === "production";

	return (
		<Html lang="en" dir="ltr">
			<Head></Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
