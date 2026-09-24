import type { Skill, SkillDefinitions } from "./types";

export const SKILLS: SkillDefinitions = [
	{ id: "arcana", label: "Arcana", stat: "INT" },
	{ id: "examination", label: "Examination", stat: "INT" },
	{ id: "lore", label: "Lore", stat: "INT" },
	{ id: "finesse", label: "Finesse", stat: "DEX" },
	{ id: "stealth", label: "Stealth", stat: "DEX" },
	{ id: "influence", label: "Influence", stat: "WIL" },
	{ id: "insight", label: "Insight", stat: "WIL" },
	{ id: "naturecraft", label: "Naturecraft", stat: "WIL" },
	{ id: "perception", label: "Perception", stat: "WIL" },
	{ id: "might", label: "Might", stat: "STR" },
];

export const FREE_SKILL_POINTS = 4;

export const DEFAULT_SKILLS: Record<Skill, number> = SKILLS.reduce(
	(acc, skill) => {
		acc[skill.id] = 0;
		return acc;
	},
	{} as Record<Skill, number>,
);
