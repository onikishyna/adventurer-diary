import { useRouter } from "expo-router";
import { useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { originIcons } from "@/entities/ancestry";
import type { Character } from "@/entities/character/types";
import { DEFAULT_SKILLS } from "@/entities/skill";
import { useCharacters } from "@/features/characters/use-characters-context";
import { CreateCharacterModal } from "@/features/create-character/components/create-character-modal";
import type { CharacterDraft } from "@/features/create-character/types";
import { SpellsBrowser } from "@/features/spells/components/spells-browser";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
	ChevronRightIcon,
	CloseIcon,
	MapIcon,
	PersonIcon,
	PlusIcon,
	ShieldIcon,
	ShieldStarIcon,
} from "@/shared/ui/icons";

type HomeTab = "characters" | "spells";

export default function HomeScreen() {
	const [homeTab, setHomeTab] = useState<HomeTab>("characters");
	const [ismodalOpen, setIsModalOpen] = useState(false);
	const [characterToDelete, setCharacterToDelete] = useState<Character | null>(
		null,
	);
	const { characters, addCharacter, deleteCharacter } = useCharacters();
	const router = useRouter();

	const handleConfirmDelete = () => {
		if (characterToDelete) deleteCharacter(characterToDelete.id);
		setCharacterToDelete(null);
	};

	const handleCreate = (draft: CharacterDraft) => {
		if (!draft.origin || !draft.background || !draft.characterClass) return;
		// racial max-HP bonus (e.g. Dwarf +2) is baked in at creation since HP
		// is an independently-tracked resource, not something re-derived on
		// every render the way defense/wounds/hit dice are
		const maxHP =
			draft.characterClass.startingHP + (draft.origin.bonuses?.maxHP ?? 0);
		const newCharacter: Character = {
			id: Date.now().toString(),
			name: draft.name,
			origin: draft.origin,
			background: draft.background,
			characterClass: draft.characterClass,
			level: 1,
			currentHP: maxHP,
			maxHP,
			stats: draft.stats ?? { STR: 0, DEX: 0, INT: 0, WIL: 0 },
			skills: draft.skills ?? DEFAULT_SKILLS,
		};
		addCharacter(newCharacter);
		setIsModalOpen(false);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

			<View style={styles.topBar}>
				<View style={styles.brand}>
					<ShieldIcon size={18} color={COLORS.accent} strokeWidth={1.5} />
					<Text style={styles.brandText}>WELCOME, ADVENTURER</Text>
				</View>
				{homeTab === "characters" && characters.length > 0 && (
					<TouchableOpacity
						style={styles.addButton}
						activeOpacity={0.8}
						onPress={() => setIsModalOpen(true)}
						accessibilityLabel="Створити нового персонажа"
					>
						<PlusIcon size={16} color={COLORS.accent} strokeWidth={2.2} />
					</TouchableOpacity>
				)}
			</View>

			{homeTab === "spells" ? (
				<SpellsBrowser />
			) : characters.length === 0 ? (
				<View style={styles.emptyArea}>
					<View style={styles.emptyAvatar}>
						<ShieldStarIcon size={46} color={COLORS.accent} strokeWidth={1.4} />
					</View>
					<View style={styles.emptyTextBlock}>
						<Text style={styles.emptyTitle}>У вас ще немає персонажів</Text>
						<Text style={styles.emptySubtitle}>
							Створіть першого героя, щоб розпочати свою пригоду
						</Text>
					</View>
					<TouchableOpacity
						style={styles.createButton}
						activeOpacity={0.85}
						onPress={() => setIsModalOpen(true)}
						accessibilityLabel="Створити нового персонажа"
					>
						<PlusIcon size={16} color={COLORS.onAccent} strokeWidth={2.2} />
						<Text style={styles.createButtonText}>Створити персонажа</Text>
					</TouchableOpacity>
				</View>
			) : (
				<>
					<Text style={styles.sectionLabel}>Ваші персонажі</Text>
					<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
						{characters.map((character) => {
							const Icon = originIcons[character.origin.id];
							return (
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
									<View style={styles.characterAvatar}>
										{Icon && (
											<Icon
												size={23}
												color={COLORS.textMuted}
												strokeWidth={1.5}
											/>
										)}
									</View>
									<View style={styles.characterInfo}>
										<Text style={styles.characterName}>{character.name}</Text>
										<Text style={styles.characterMeta}>
											{character.origin.origin} ·{" "}
											{character.characterClass.background} · Рівень{" "}
											{character.level}
										</Text>
									</View>
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() => setCharacterToDelete(character)}
										hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
										accessibilityLabel="Видалити персонажа"
									>
										<CloseIcon
											size={11}
											color={COLORS.textFaint}
											strokeWidth={1.8}
										/>
									</TouchableOpacity>
									<ChevronRightIcon
										size={16}
										color={COLORS.textFaint}
										strokeWidth={1.8}
									/>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</>
			)}

			<View style={styles.bottomNav}>
				<TouchableOpacity
					style={styles.navItem}
					activeOpacity={0.7}
					onPress={() => setHomeTab("characters")}
				>
					<PersonIcon
						size={20}
						color={homeTab === "characters" ? COLORS.accent : COLORS.textFaint}
						strokeWidth={1.8}
					/>
					<Text
						style={[
							styles.navLabel,
							homeTab === "characters" && styles.navLabelActive,
						]}
					>
						Персонажі
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.navItem}
					activeOpacity={0.7}
					onPress={() => setHomeTab("spells")}
				>
					<MapIcon
						size={20}
						color={homeTab === "spells" ? COLORS.accent : COLORS.textFaint}
						strokeWidth={1.6}
					/>
					<Text
						style={[
							styles.navLabel,
							homeTab === "spells" && styles.navLabelActive,
						]}
					>
						Заклинання
					</Text>
				</TouchableOpacity>
			</View>

			<CreateCharacterModal
				visible={ismodalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreate}
			/>

			<ConfirmDialog
				visible={!!characterToDelete}
				title="Видалити персонажа?"
				message={
					characterToDelete
						? `«${characterToDelete.name}» буде видалено назавжди. Цю дію не можна скасувати.`
						: ""
				}
				confirmLabel="Видалити"
				destructive
				onConfirm={handleConfirmDelete}
				onCancel={() => setCharacterToDelete(null)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},

	topBar: {
		paddingTop: 12,
		paddingHorizontal: 24,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	brand: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	brandText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		letterSpacing: 2,
		color: COLORS.text,
	},
	addButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},

	emptyArea: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
		gap: 22,
	},
	emptyAvatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyTextBlock: {
		alignItems: "center",
		gap: 8,
	},
	emptyTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 21,
		color: COLORS.text,
		textAlign: "center",
	},
	emptySubtitle: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13.5,
		color: COLORS.textMuted,
		textAlign: "center",
		lineHeight: 21,
		maxWidth: 260,
	},
	createButton: {
		width: "100%",
		height: 52,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.accent,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginTop: 6,
	},
	createButtonText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.onAccent,
		letterSpacing: 0.4,
	},

	sectionLabel: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
		paddingHorizontal: 24,
		paddingTop: 18,
	},
	list: {
		flex: 1,
		paddingHorizontal: 24,
	},
	characterCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.xl,
		padding: 12,
		marginTop: 10,
		backgroundColor: COLORS.bgElev,
	},
	characterAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	characterInfo: {
		flex: 1,
		gap: 2,
		minWidth: 0,
	},
	characterName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.text,
	},
	characterMeta: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 11.5,
		color: COLORS.textMuted,
	},
	deleteButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.bgElev2,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},

	bottomNav: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		paddingTop: 10,
		paddingBottom: 22,
		paddingHorizontal: 12,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
		backgroundColor: COLORS.bg,
	},
	navItem: {
		alignItems: "center",
		gap: 4,
	},
	navLabel: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 9.5,
		color: COLORS.textFaint,
	},
	navLabelActive: {
		fontFamily: FONTS.bodySemiBold,
		color: COLORS.accent,
	},
});
