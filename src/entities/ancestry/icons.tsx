import type { ComponentType } from "react";
import {
	DragonbornIcon,
	DryadIcon,
	DwarfIcon,
	type IconProps,
} from "@/shared/ui/icons";

export const originIcons: Record<string, ComponentType<IconProps>> = {
	dwarf: DwarfIcon,
	dragonborn: DragonbornIcon,
	dryad: DryadIcon,
};
