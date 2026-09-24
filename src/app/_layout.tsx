import {
	Cinzel_500Medium,
	Cinzel_600SemiBold,
	Cinzel_700Bold,
} from "@expo-google-fonts/cinzel";
import {
	WorkSans_400Regular,
	WorkSans_500Medium,
	WorkSans_600SemiBold,
	WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { CharacterProvider } from "@/features/characters/use-characters-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		Cinzel_500Medium,
		Cinzel_600SemiBold,
		Cinzel_700Bold,
		WorkSans_400Regular,
		WorkSans_500Medium,
		WorkSans_600SemiBold,
		WorkSans_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<CharacterProvider>
			<Stack />
		</CharacterProvider>
	);
}
