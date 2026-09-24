import type { ComponentType } from "react";
import {
	BerserkIcon,
	type IconProps,
	ShadowmancerIcon,
	StormshifterIcon,
	ZephyrIcon,
} from "@/shared/ui/icons";

export const classIcons: Record<string, ComponentType<IconProps>> = {
	berserk: BerserkIcon,
	shadowmancer: ShadowmancerIcon,
	stormshifter: StormshifterIcon,
	ZEPHYR: ZephyrIcon,
};
