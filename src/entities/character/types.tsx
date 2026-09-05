import type { Origin } from "@/entities/ancestry";
import type { Background } from "@/entities/background";
import type { CharacterClass, Stat } from "@/entities/character-classes";

export interface Character {
	id: string;
	name: string;

	origin: Origin;
	background: Background;
	characterClass: CharacterClass;

	level: number;
	currentHP: number;
	maxHP: number;

	stats: Record<Stat, number>;
}
