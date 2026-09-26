import type { Skill } from "@/entities/skill";

export type Stat = "STR" | "DEX" | "INT" | "WIL";

export type Save = `${Stat}+` | `${Stat}–`;

export interface StatIncrease {
	pool: "key" | "secondary" | "any";
	count: number;
}

// a spendable class resource tracked on the sheet (shapeshift charges,
// mana…); its max is re-derived from the character on every render
export interface ClassResource {
	id: string;
	label: string;
	// the level the resource unlocks at; available from level 1 when omitted
	minLevel?: number;
	max: (character: {
		stats: Record<Stat, number>;
		level: number;
		subclassId?: string;
	}) => number;
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
	// the last level it's shown at, for text replaced by a stronger version
	// later (e.g. Rage's 1 Fury Die → 2 at level 5)
	maxLevel?: number;
}

// a pick-one-of-many granted at specific levels (e.g. Shadowmancer
// invocations); each listed level adds one pick, never repeating an option
export interface ClassChoice {
	id: string;
	// singular, for the level-up step ("Інвокація")
	label: string;
	// plural, for the reference section ("Інвокації")
	sectionTitle: string;
	levels: number[];
	// picks granted at a level when more than one (e.g. { 6: 2 })
	countAt?: Record<number, number>;
	// extra picks only for one subclass, by subclass id then level (e.g.
	// Fang & Claw's { "fang-claw": { 15: 2 } }); these levels needn't be
	// in `levels`
	subclassCountAt?: Record<string, Record<number, number>>;
	options: ClassChoiceOption[];
}

// flat, unconditional effects of a level-up choice or boon, applied by the
// sheet while it's taken; conditional ones ("while in Rage") stay text-only
export interface OptionBonuses {
	maxWounds?: number;
	defense?: number;
	initiative?: number;
	speed?: number;
	hitDice?: number;
	// max of the class's "mana" resource (no effect for classes without one)
	mana?: number;
	// max mana per point of the class's KEY stat (Smart, Not Book Smart: −1)
	manaPerKey?: number;
	skills?: Partial<Record<Skill, number>>;
	// stored HP, not derived: applied to max and current HP once when the
	// option is added, and taken back when it's removed
	maxHP?: number;
}

export interface ClassChoiceOption extends ClassFeature {
	id: string;
	bonuses?: OptionBonuses;
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
	// the default Захист before racial bonuses; DEX when omitted
	defense?: (character: {
		stats: Record<Stat, number>;
		level: number;
	}) => number;
	resources?: ClassResource[];
	// flat bonus added to the base speed, may depend on level
	speedBonus?: (character: { level: number }) => number;
	weapons: string[];
	startingGear: string[];
	features: ClassFeature[];
	subclasses?: Subclass[];
	choices?: ClassChoice[];
}

export type CharacterClasses = CharacterClass[];
