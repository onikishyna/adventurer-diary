import { useLocalSearchParams, useRouter } from "expo-router";
import { CharacterSheet } from "@/features/characters/components/character-sheet";
import { useCharacters } from "@/features/characters/use-characters-context";

export default function CharacterScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { characters } = useCharacters();
	const router = useRouter();

	const character = characters.find((c) => c.id === id);

	if (!character) return null;

	return (
		<CharacterSheet character={character} onClose={() => router.replace("/")} />
	);
}
