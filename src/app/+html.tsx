import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="uk">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#150A06" />
				<link rel="manifest" href="/manifest.json" />

				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-title" content="Nimble Sheet" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

				<ScrollViewStyleReset />
				<style
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static page background
					dangerouslySetInnerHTML={{
						__html: "html, body { background-color: #150A06; }",
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
