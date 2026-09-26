import type { ImageSourcePropType } from "react-native";
import dragonbornImage from "@/assets/images/dragonborn.png";
import dragonbornRedImage from "@/assets/images/dragonborn-red.png";
import dragonbornWhiteImage from "@/assets/images/dragonborn-white.jpg";
import dryadImage from "@/assets/images/dryad.png";
import dwarfImage from "@/assets/images/dwarf.png";

export const originImages: Record<string, any> = {
	dragonborn: dragonbornImage,
	dwarf: dwarfImage,
	dryad: dryadImage,
};

export const extraPortraits: {
	id: string;
	label: string;
	source: ImageSourcePropType;
}[] = [
	{
		id: "dragonborn-white",
		label: "Білий дракон",
		source: dragonbornWhiteImage,
	},
	{
		id: "dragonborn-red",
		label: "Червоний дракон",
		source: dragonbornRedImage,
	},
];

export const portraitImages: Record<string, ImageSourcePropType> = {
	...originImages,
	...Object.fromEntries(extraPortraits.map(({ id, source }) => [id, source])),
};
