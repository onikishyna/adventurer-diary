import { BOON_TIERS } from "@/entities/boon";
import type { Character } from "@/entities/character/types";
import {
	type CharacterClass,
	type ClassChoiceOption,
	heroes,
	type OptionBonuses,
} from "@/entities/character-classes";
import type { Skill } from "@/entities/skill";

const ALL_BOONS = BOON_TIERS.flatMap((tier) => tier.boons);

export const findBoon = (boonId: string) =>
	ALL_BOONS.find((boon) => boon.id === boonId);

export const getClassRules = (
	character: Character,
): CharacterClass | undefined =>
	heroes.find((hero) => hero.id === character.characterClass.id);

export function getBonusSources(character: Character): ClassChoiceOption[] {
	const classRules = getClassRules(character);
	const choiceOptions = (classRules?.choices ?? []).flatMap((choice) =>
		(character.choices?.[choice.id] ?? [])
			.map((optionId) =>
				choice.options.find((option) => option.id === optionId),
			)
			.filter((option) => option !== undefined),
	);
	const boons = (character.boons ?? [])
		.map(findBoon)
		.filter((boon) => boon !== undefined);
	return [...choiceOptions, ...boons];
}

type NumericBonus = Exclude<keyof OptionBonuses, "skills">;

export const sumBonus = (sources: ClassChoiceOption[], key: NumericBonus) =>
	sources.reduce((sum, source) => sum + (source.bonuses?.[key] ?? 0), 0);

export const sumSkillBonus = (sources: ClassChoiceOption[], skill: Skill) =>
	sources.reduce(
		(sum, source) => sum + (source.bonuses?.skills?.[skill] ?? 0),
		0,
	);
