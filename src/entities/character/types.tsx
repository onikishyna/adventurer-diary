import type { Origin } from "@/entities/ancestry";
import type { Background } from "@/entities/background";
import type { CharacterClass, Stat } from "@/entities/character-classes";
import type { Skill } from "@/entities/skill";

export interface Character {
	id: string;
	name: string;
	portrait?: string;

	origin: Origin;
	background: Background;
	characterClass: CharacterClass;

	level: number;
	currentHP: number;
	maxHP: number;
	wounds?: number;
	tempHP?: number;
	tempHPMax?: number;

	stats: Record<Stat, number>;
	skills?: Record<Skill, number>;
	defense?: number | null;
	initiative?: number | null;
	speed?: number | null;
	spells?: string[];
	inventory?: InventoryItem[];
	notes?: CharacterNote[];
	subclassId?: string;
	choices?: Record<string, string[]>;
	boons?: string[];
	usedResources?: Record<string, number>;
	resourceValues?: Record<string, number | null>;
}

export interface InventoryItem {
	id: string;
	name: string;
	quantity: number;
}

export interface CharacterNote {
	id: string;
	text: string;
}
