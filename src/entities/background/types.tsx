import type { Skill } from "@/entities/skill";

// structured mechanical effects extracted from `description` — kept
// separate from the free-text description so character creation/the sheet
// can apply them without parsing prose
export interface BackgroundBonuses {
	skill?: Skill;
	skillBonus?: number;
	hitDiceBonus?: number;
}

export interface Background {
	id: string;
	title: string;
	description: string;
	bonuses?: BackgroundBonuses;
}

export type Backgrounds = Background[];
