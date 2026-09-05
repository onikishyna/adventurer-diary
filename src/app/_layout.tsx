import { Stack } from "expo-router";
import { CharacterProvider } from "@/features/characters/use-characters-context";

export default function RootLayout() {
	return (
		<CharacterProvider>
			<Stack />
		</CharacterProvider>
	);
}
