import type { Origin } from "@/entities/ancestry";
import type { Background } from "@/entities/background";
import type { CharacterClass, Stat } from "@/entities/character-classes";
import type { Skill } from "@/entities/skill";

export type CreationStep =
	| "name"
	| "origin"
	| "background"
	| "class"
	| "stats"
	| "skills"
	| "summary";

export interface CharacterDraft {
	name: string;
	origin: Origin | null;
	background: Background | null;
	characterClass: CharacterClass | null;
	level: number;
	stats: Record<Stat, number> | null;
	skills: Record<Skill, number> | null;
}

export const INITIAL_DRAFT: CharacterDraft = {
	name: "",
	origin: null,
	background: null,
	characterClass: null,
	level: 1,
	stats: null,
	skills: null,
};
