import React, { useEffect, useState } from "react";
import {
	IMAGE_GIF,
	IMG_APNG,
	IMG_AVIF,
	IMG_GIF,
	IMG_JPEG,
	IMG_PNG,
	IMG_SVG,
	IMG_WEBP,
	TEXT_PLAIN,
} from "../mimeTypes";
import { IMimeBundle } from "@jupyterlab/nbformat";

function ImageRenderer({ data }: { data: IMimeBundle }) {
	const [src, setSource] = useState("");
	const [alt, setAltText] = useState("");
	const getMimeType = (data: IMimeBundle) => {
		const mimeTypes = Object.keys(data)
			.map((mimeType) => {
				switch (mimeType) {
					case IMG_GIF:
						return IMAGE_GIF;
					case IMG_APNG:
						return IMG_APNG;
					case IMG_AVIF:
						return IMG_AVIF;
					case IMG_GIF:
						return IMG_GIF;
					case IMG_JPEG:
						return IMG_JPEG;
					case IMG_PNG:
						return IMG_PNG;
					case IMG_WEBP:
						return IMG_WEBP;
					default:
						return null;
				}
			})
			.filter((key) => key);

		return mimeTypes.length > 0 ? mimeTypes[0] : null;
	};

	useEffect(() => {
		const mimeType = getMimeType(data);
		if (!mimeType) {
			console.error("Could not find mimeType: ", mimeType);
			return;
		}
		const srcFormatted = "data:" + mimeType + ";base64," + data[mimeType];
		const altText = data[TEXT_PLAIN] as string;
		setSource(srcFormatted);
		setAltText(altText);
	}, [data]);

	// eslint-disable-next-line @next/next/no-img-element
	return <img src={src} alt={alt} width={"auto"} />;
}

export default ImageRenderer;
