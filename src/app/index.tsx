import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { originImages } from "@/entities/ancestry";
import type { Character } from "@/entities/character/types";
import { useCharacters } from "@/features/characters/use-characters-context";
import { CreateCharacterModal } from "@/features/create-character/components/create-character-modal";
import type { CharacterDraft } from "@/features/create-character/types";

const COLORS = {
	background: "#F2EBDE",
	backgroundLight: "#FAF6EE",
	dark: "#12131A",
	surface: "#23202E",
	text: "#2E2720",
	textSecondary: "#7A6E61",
	accent: "#5B21B6",
};

export default function HomeScreen() {
	const [ismodalOpen, setIsModalOpen] = useState(false);
	const { characters, addCharacter, deleteCharacter } = useCharacters();
	const router = useRouter();

	const handleCreate = (draft: CharacterDraft) => {
		if (!draft.origin || !draft.background || !draft.characterClass) return;
		const newCharacter: Character = {
			id: Date.now().toString(),
			name: draft.name,
			origin: draft.origin,
			background: draft.background,
			characterClass: draft.characterClass,
			level: 1,
			currentHP: draft.characterClass.startingHP,
			maxHP: draft.characterClass.startingHP,
			stats: draft.stats ?? { STR: 0, DEX: 0, INT: 0, WIL: 0 },
		};
		addCharacter(newCharacter);
		setIsModalOpen(false);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

			<View style={styles.header}>
				<Text style={styles.title}>Привіт, пригоднику!</Text>
				<View style={styles.divider} />
				<Text style={styles.subtitle}>
					Твої історії чекають, щоб їх написали.
				</Text>
			</View>

			<View style={styles.centerArea}>
				{characters.length === 0 ? (
					<Text style={styles.emptyText}>Твоя пригода ще не почалась...</Text>
				) : (
					<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
						{characters.map((character) => (
							<TouchableOpacity
								key={character.id}
								style={styles.characterCard}
								activeOpacity={0.7}
								onPress={() =>
									router.push({
										pathname: "/character/[id]",
										params: { id: character.id },
									})
								}
							>
								<View style={styles.characterCardAccent} />
								<Image
									source={originImages[character.origin.id]}
									style={styles.characterImage}
								/>
								<View style={styles.characterInfo}>
									<Text style={styles.characterName}>{character.name}</Text>
									<Text style={styles.characterOrigin}>
										{character.origin.origin}
									</Text>
								</View>

								<TouchableOpacity
									style={styles.deleteButton}
									onPress={() => deleteCharacter(character.id)}
									hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
								>
									<Text style={styles.deleteIcon}>✕</Text>
								</TouchableOpacity>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</View>

			<View style={styles.fabContainer}>
				<TouchableOpacity
					style={styles.fab}
					activeOpacity={0.8}
					onPress={() => setIsModalOpen(true)}
					accessibilityLabel="Створити нового персонажа"
				>
					<Text style={styles.fabIcon}>+</Text>
				</TouchableOpacity>
			</View>

			<CreateCharacterModal
				visible={ismodalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreate}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},

	header: {
		paddingTop: 48,
		paddingHorizontal: 28,
		paddingBottom: 24,
	},
	title: {
		fontFamily: "serif",
		fontSize: 28,
		fontWeight: "600",
		color: COLORS.dark,
		letterSpacing: 0.5,
		marginBottom: 16,
	},
	divider: {
		height: 1.5,
		backgroundColor: COLORS.accent,
		marginBottom: 14,
		opacity: 0.7,
	},
	subtitle: {
		fontFamily: "serif",
		fontSize: 17,
		fontStyle: "italic",
		color: COLORS.textSecondary,
	},

	centerArea: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	emptyText: {
		fontFamily: "serif",
		fontSize: 20,
		fontStyle: "italic",
		color: COLORS.textSecondary,
		textAlign: "center",
	},

	fabContainer: {
		paddingBottom: 36,
		paddingHorizontal: 28,
		alignItems: "flex-end",
	},
	fab: {
		width: 58,
		height: 58,
		borderRadius: 29,
		backgroundColor: "#4D355F",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: COLORS.dark,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 10,
		elevation: 6,
	},
	fabIcon: {
		color: COLORS.background,
		fontSize: 30,
		lineHeight: 34,
		fontWeight: "300",
		includeFontPadding: false,
	},
	list: {
		width: "100%",
	},
	characterCard: {
		borderWidth: 1,
		borderColor: "rgba(46,39,32,0.15)",
		borderRadius: 16,
		paddingVertical: 24,
		paddingHorizontal: 28,
		marginBottom: 16,
		backgroundColor: "#FAF6EE",
		shadowColor: "#2E2720",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 3,
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	characterName: {
		fontSize: 20,
		fontWeight: "600",
		color: "#12131A",
		letterSpacing: 2,
		textTransform: "uppercase",
		marginBottom: 6,
	},
	characterOrigin: {
		fontSize: 13,
		fontStyle: "italic",
		color: "#7A6E61",
		letterSpacing: 0.3,
	},
	characterCardAccent: {
		position: "absolute",
		left: 0,
		top: 16,
		bottom: 16,
		width: 3,
		borderRadius: 999,
		backgroundColor: "#5B21B6",
		opacity: 0.6,
	},
	characterImage: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "rgba(46,39,32,0.06)",
	},
	characterInfo: {
		flex: 1,
	},
	deleteButton: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(46,39,32,0.07)",
		alignItems: "center",
		justifyContent: "center",
	},
	deleteIcon: {
		fontSize: 11,
		color: "#7A6E61",
	},
});
