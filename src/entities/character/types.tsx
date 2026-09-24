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
	// optional: characters saved before the skills step existed won't have this
	skills?: Record<Skill, number>;

	// derived combat stats — default to DEX when null/unset, but the player
	// can override either with their own number
	defense?: number | null;
	initiative?: number | null;

	// ids of spells (see src/entities/spell) the character has learned
	spells?: string[];

	// freeform inventory — just a name and a quantity, no item catalog/types
	inventory?: InventoryItem[];
}

export interface InventoryItem {
	id: string;
	name: string;
	quantity: number;
}
