// structured mechanical effects extracted from `ability` — kept separate
// from the free-text description so character creation/the sheet can apply
// them without parsing prose
export interface OriginBonuses {
	maxHP?: number;
	maxWounds?: number;
	defense?: number;
	speed?: number;
}

export interface Origin {
	id: string;
	origin: string;
	size: string;
	description: string;
	ability: string[];
	bonuses?: OriginBonuses;
}

export type Origins = Origin[];
