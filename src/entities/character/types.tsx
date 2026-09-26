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
	wounds?: number;
	// temporary HP: the current pool and the amount last granted (its max)
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
	// Subclass.id chosen on reaching SUBCLASS_LEVEL
	subclassId?: string;
	// picked option ids per ClassChoice.id, in the order they were taken
	choices?: Record<string, string[]>;
	// boon ids (any BOON_TIERS tier) granted by the GM, in the order added
	boons?: string[];
	// spent amount per class resource, keyed by ClassResource.id
	usedResources?: Record<string, number>;
	// hand-entered values of "field" resources; null/absent = the max
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
