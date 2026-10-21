import type { Character } from "@/entities/character/types";

const BACKUP_APP = "nimble-sheet";

export function serializeBackup(characters: Character[]): string {
	return JSON.stringify(
		{
			app: BACKUP_APP,
			version: 1,
			exportedAt: new Date().toISOString(),
			characters,
		},
		null,
		2,
	);
}

const isCharacter = (value: unknown): value is Character => {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as Partial<Character>;
	return (
		typeof candidate.id === "string" &&
		typeof candidate.name === "string" &&
		typeof candidate.level === "number" &&
		typeof candidate.origin === "object" &&
		typeof candidate.characterClass === "object" &&
		typeof candidate.stats === "object"
	);
};

export function parseBackup(
	text: string,
): { characters: Character[] } | { error: string } {
	let data: unknown;
	try {
		data = JSON.parse(text);
	} catch {
		return { error: "Це не схоже на резервну копію: текст не читається." };
	}
	const list = Array.isArray(data)
		? data
		: (data as { characters?: unknown })?.characters;
	if (!Array.isArray(list)) {
		return { error: "У копії не знайдено списку персонажів." };
	}
	const characters = list.filter(isCharacter);
	if (characters.length === 0) {
		return { error: "У копії немає жодного персонажа." };
	}
	return { characters };
}
