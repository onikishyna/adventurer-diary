export type Stat = "STR" | "DEX" | "INT" | "WIL";

export type Save = `${Stat}+` | `${Stat}–`;

// a spendable class resource tracked on the sheet (shapeshift charges,
// mana…); its max is re-derived from the character on every render
export interface ClassResource {
	id: string;
	label: string;
	// the level the resource unlocks at; available from level 1 when omitted
	minLevel?: number;
	max: (character: { stats: Record<Stat, number>; level: number }) => number;
	// "pips" (default): a tap-to-spend row with its own section;
	// "field": an editable number card among the derived stats, defaulting
	// to max — `code` is its short card heading
	display?: "pips" | "field";
	code?: string;
}

// a rules block shown in the class reference: a heading plus its lines
// (lines starting with "–" render as list items)
export interface ClassFeature {
	title: string;
	lines: string[];
	// the level the feature is gained at; level 1 when omitted
	minLevel?: number;
}

// a specialization picked once, at SUBCLASS_LEVEL; text-only for now
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
	// stats summed into the default Захист; DEX alone when omitted
	defenseStats?: Stat[];
	resources?: ClassResource[];
	// flat bonus added to the base speed, may depend on level
	speedBonus?: (character: { level: number }) => number;
	weapons: string[];
	startingGear: string[];
	features: ClassFeature[];
	subclasses?: Subclass[];
}

export type CharacterClasses = CharacterClass[];
