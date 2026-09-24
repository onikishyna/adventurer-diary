export type SpellSchool =
	| "fire"
	| "lightning"
	| "ice"
	| "light"
	| "wind"
	| "necrotic"
	| "cantrip";

export interface SpellSchoolDefinition {
	id: SpellSchool;
	label: string;
	// hex accent used for this school's icon/badge — not the shared theme, so
	// this entity stays independent of the UI layer
	color: string;
}

export interface Spell {
	id: string;
	name: string;
	school: SpellSchool;
	// display label, e.g. "Кантріп" or "Рівень 3"
	tier: string;
	// action cost, e.g. "1 Дія", "2 Дії", "5 Дій"
	actions: string;
	// e.g. "Одна ціль", "На себе", "По області"
	target: string;
	// main effect text; "\n" separates lines (e.g. multi-part abilities)
	description: string;
	// upcast/high-level scaling text, shown separately when present
	upcast?: string;
	// for school "cantrip" only: the elemental theme this utility cantrip is
	// grouped under in its source material (e.g. "ice", "fire") — shown as a
	// label since these cantrips don't belong to that school's own spell list
	flavor?: SpellSchool;
}
