import type { Stat } from "@/entities/character-classes";

export type Skill =
	| "arcana"
	| "examination"
	| "lore"
	| "finesse"
	| "stealth"
	| "influence"
	| "insight"
	| "naturecraft"
	| "perception"
	| "might";

export interface SkillDefinition {
	id: Skill;
	label: string;
	// the skill's base value equals this stat's score before free points are added
	stat: Stat;
}

export type SkillDefinitions = SkillDefinition[];
