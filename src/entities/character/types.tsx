import type { Origin } from "@/entities/ancestry";
import type { Background } from "@/entities/background";
import type { CharacterClass, Stat } from "@/entities/character-classes";
import type { Skill } from "@/entities/skill";

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
	skills?: Record<Skill, number>;
	defense?: number | null;
	initiative?: number | null;
	spells?: string[];
	inventory?: InventoryItem[];
}

export interface InventoryItem {
	id: string;
	name: string;
	quantity: number;
}
