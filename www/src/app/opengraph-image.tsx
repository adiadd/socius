import { ImageResponse } from "next/og";
import { siteConfig } from "../config/site";

export const alt = `${siteConfig.name} - ${siteConfig.description.short}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
	return new ImageResponse(
		<div
			style={{
				fontSize: 48,
				background: "white",
				color: "black",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 24,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 24,
				}}
			>
				{/* You can add a logo image here */}
				<div
					style={{
						width: 64,
						height: 64,
						borderRadius: 8,
						background: "black",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginRight: 16,
					}}
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-labelledby="brainCircuitTitle"
					>
						<title id="brainCircuitTitle">Brain Circuit Icon</title>
						<path
							d="M2 10C2 6.68629 4.68629 4 8 4H16C19.3137 4 22 6.68629 22 10V14C22 17.3137 19.3137 20 16 20H8C4.68629 20 2 17.3137 2 14V10Z"
							stroke="white"
							strokeWidth="2"
						/>
						<path
							d="M6 8L6 16"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M9 12H15"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M18 8V16"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div
					style={{
						fontSize: 64,
						fontWeight: 700,
					}}
				>
					{siteConfig.name}
				</div>
			</div>
			<div
				style={{
					fontSize: 32,
					textAlign: "center",
					maxWidth: "80%",
				}}
			>
				{siteConfig.description.short}
			</div>
		</div>,
		{ ...size },
	);
}
