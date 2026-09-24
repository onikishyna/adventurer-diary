import type { ComponentType } from "react";
import {
	FlameIcon,
	type IconProps,
	LightningIcon,
	SkullIcon,
	SnowflakeIcon,
	SparkleIcon,
	SunIcon,
	WindIcon,
} from "@/shared/ui/icons";
import type { SpellSchool } from "./types";

export const schoolIcons: Record<SpellSchool, ComponentType<IconProps>> = {
	cantrip: SparkleIcon,
	fire: FlameIcon,
	lightning: LightningIcon,
	ice: SnowflakeIcon,
	light: SunIcon,
	wind: WindIcon,
	necrotic: SkullIcon,
};
