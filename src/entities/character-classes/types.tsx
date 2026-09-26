import type { Skill } from "@/entities/skill";

export type Stat = "STR" | "DEX" | "INT" | "WIL";

export type Save = `${Stat}+` | `${Stat}–`;

export interface StatIncrease {
	pool: "key" | "secondary" | "any";
	count: number;
}

export interface ClassResource {
	id: string;
	label: string;
	minLevel?: number;
	max: (character: {
		stats: Record<Stat, number>;
		level: number;
		subclassId?: string;
	}) => number;
	display?: "pips" | "field";
	code?: string;
}

export interface ClassFeature {
	title: string;
	lines: string[];
	minLevel?: number;
	maxLevel?: number;
}

export interface ClassChoice {
	id: string;
	label: string;
	sectionTitle: string;
	levels: number[];
	countAt?: Record<number, number>;
	subclassCountAt?: Record<string, Record<number, number>>;
	options: ClassChoiceOption[];
}

export interface OptionBonuses {
	maxWounds?: number;
	defense?: number;
	initiative?: number;
	speed?: number;
	hitDice?: number;
	mana?: number;
	manaPerKey?: number;
	skills?: Partial<Record<Skill, number>>;
	maxHP?: number;
}

export interface ClassChoiceOption extends ClassFeature {
	id: string;
	bonuses?: OptionBonuses;
}

export interface Subclass {
	id: string;
	name: string;
	tagline: string;
	features: ClassFeature[];
}

export interface CharacterClass {
	id: string;
	background: string;
	keyStats: Stat[];
	hitDie: number;
	startingHP: number;
	saves: Save[];
	armor: string;
	defense?: (character: {
		stats: Record<Stat, number>;
		level: number;
	}) => number;
	resources?: ClassResource[];
	speedBonus?: (character: { level: number }) => number;
	weapons: string[];
	startingGear: string[];
	features: ClassFeature[];
	subclasses?: Subclass[];
	choices?: ClassChoice[];
}

export type CharacterClasses = CharacterClass[];
