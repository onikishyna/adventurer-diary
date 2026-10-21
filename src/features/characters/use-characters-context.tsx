import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Character } from "@/entities/character";

interface CharacterContextType {
	characters: Character[];
	addCharacter: (character: Character) => void;
	deleteCharacter: (id: string) => void;
	updateCharacter: (
		id: string,
		patch: Partial<Character> | ((character: Character) => Partial<Character>),
	) => void;
	importCharacters: (imported: Character[]) => {
		added: number;
		updated: number;
	};
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem("characters")
			.then((raw) => {
				if (raw) {
					setCharacters(JSON.parse(raw));
				}
			})
			.finally(() => setIsLoaded(true));
	}, []);

	useEffect(() => {
		if (!isLoaded) return;
		AsyncStorage.setItem("characters", JSON.stringify(characters));
	}, [characters, isLoaded]);

	const addCharacter = (character: Character) => {
		setCharacters((prev) => [...prev, character]);
	};
	const deleteCharacter = (id: string) => {
		setCharacters((prev) => prev.filter((character) => character.id !== id));
	};
	const updateCharacter = (
		id: string,
		patch: Partial<Character> | ((character: Character) => Partial<Character>),
	) => {
		setCharacters((prev) =>
			prev.map((character) =>
				character.id === id
					? {
							...character,
							...(typeof patch === "function" ? patch(character) : patch),
						}
					: character,
			),
		);
	};

	const importCharacters = (imported: Character[]) => {
		const existingIds = new Set(characters.map((character) => character.id));
		const updated = imported.filter((character) =>
			existingIds.has(character.id),
		).length;
		setCharacters((prev) => {
			const importedById = new Map(
				imported.map((character) => [character.id, character]),
			);
			const merged = prev.map(
				(character) => importedById.get(character.id) ?? character,
			);
			const prevIds = new Set(prev.map((character) => character.id));
			return [
				...merged,
				...imported.filter((character) => !prevIds.has(character.id)),
			];
		});
		return { added: imported.length - updated, updated };
	};

	return (
		<CharacterContext.Provider
			value={{
				characters,
				addCharacter,
				deleteCharacter,
				updateCharacter,
				importCharacters,
			}}
		>
			{children}
		</CharacterContext.Provider>
	);
};

export const useCharacters = () => {
	const ctx = useContext(CharacterContext);
	if (!ctx)
		throw new Error("useCharacters must be used within CharacterProvider");
	return ctx;
};
