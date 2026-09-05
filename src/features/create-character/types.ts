import type { Origin } from "@/entities/ancestry";
import type { Background } from "@/entities/background";
import type { CharacterClass, Stat } from "@/entities/character-classes";

export type CreationStep =
	| "name"
	| "origin"
	| "background"
	| "class"
	| "stats"
	| "summary";

export interface CharacterDraft {
	name: string;
	origin: Origin | null;
	background: Background | null;
	characterClass: CharacterClass | null;
	level: number;
	stats: Record<Stat, number> | null;
}

export const INITIAL_DRAFT: CharacterDraft = {
	name: "",
	origin: null,
	background: null,
	characterClass: null,
	level: 1,
	stats: null,
};
