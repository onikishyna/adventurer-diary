export type Stat = "STR" | "DEX" | "INT" | "WIL";

export type Save = `${Stat}+` | `${Stat}–`;

export interface CharacterClass {
	id: string;
	background: string;
	keyStats: Stat[];
	hitDie: number;
	startingHP: number;
	saves: Save[];
	armor: string;
	weapons: string[];
	startingGear: string[];
}

export type CharacterClasses = CharacterClass[];
