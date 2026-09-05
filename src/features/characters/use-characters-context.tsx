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
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
	const [characters, setCharacters] = useState<Character[]>([]);

	useEffect(() => {
		AsyncStorage.getItem("characters").then((raw) => {
			if (raw) {
				setCharacters(JSON.parse(raw));
			}
		});
	}, []);

	useEffect(() => {
		AsyncStorage.setItem("characters", JSON.stringify(characters));
	}, [characters]);

	const addCharacter = (character: Character) => {
		setCharacters((prev) => [...prev, character]);
	};
	const deleteCharacter = (id: string) => {
		setCharacters((prev) => prev.filter((character) => character.id !== id));
	};

	return (
		<CharacterContext.Provider
			value={{ characters, addCharacter, deleteCharacter }}
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
