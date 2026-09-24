import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { originImages } from "@/entities/ancestry";
import type { Character } from "@/entities/character/types";
import type { Save, Stat } from "@/entities/character-classes";
import { SKILLS } from "@/entities/skill";
import { SPELLS } from "@/entities/spell";
import { AddItemModal } from "@/features/characters/components/add-item-modal";
import { QuantityStepper } from "@/features/characters/components/quantity-stepper";
import { useCharacters } from "@/features/characters/use-characters-context";
import { SpellPickerModal } from "@/features/spells/components/spell-picker-modal";
import { SpellRow } from "@/features/spells/components/spell-row";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import {
	BackpackIcon,
	ChevronLeftIcon,
	CloseIcon,
	MinusIcon,
	PlusIcon,
	SettingsIcon,
	SparkleIcon,
} from "@/shared/ui/icons";

interface Props {
	character: Character;
	onClose: () => void;
}

const STATS = [
	{ code: "STR", label: "Сила" },
	{ code: "DEX", label: "Спритність" },
	{ code: "INT", label: "Інтелект" },
	{ code: "WIL", label: "Воля" },
] as const;

const MAX_WOUNDS = 5;

const formatSigned = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

// a class's saves list marks a stat as either proficient ("STR+") or weak
// ("STR–", note: en dash) — surfaced on the sheet as a small corner badge
function getSaveMark(saves: Save[], stat: Stat): "up" | "down" | null {
	if (saves.includes(`${stat}+` as Save)) return "up";
	if (saves.includes(`${stat}–` as Save)) return "down";
	return null;
}

interface EditableStatCardProps {
	code: string;
	label: string;
	value: number;
	onChangeValue: (next: number | null) => void;
}

function EditableStatCard({
	code,
	label,
	value,
	onChangeValue,
}: EditableStatCardProps) {
	const [text, setText] = useState(formatSigned(value));
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		setText(formatSigned(value));
	}, [value]);

	const handleBlur = () => {
		setIsFocused(false);
		const trimmed = text.trim();
		if (trimmed === "") {
			onChangeValue(null);
			return;
		}
		const parsed = Number.parseInt(trimmed, 10);
		if (Number.isNaN(parsed)) {
			setText(formatSigned(value));
			return;
		}
		onChangeValue(parsed);
		setText(formatSigned(parsed));
	};

	return (
		<View style={styles.statCard}>
			<View>
				<Text style={styles.statCode}>{code}</Text>
				<Text style={styles.statLabel}>{label}</Text>
			</View>
			<TextInput
				style={[
					styles.statValueInput,
					isFocused ? styles.statValueInputFocused : styles.statValueInputIdle,
				]}
				value={text}
				onChangeText={setText}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				keyboardType="numbers-and-punctuation"
				maxLength={4}
				selectTextOnFocus
			/>
		</View>
	);
}

interface StatBarProps {
	label: string;
	value: number;
	max: number;
	fillColor: string;
	onDecrement: () => void;
	onIncrement: () => void;
}

function StatBar({
	label,
	value,
	max,
	fillColor,
	onDecrement,
	onIncrement,
}: StatBarProps) {
	const pct = Math.round((value / max) * 100);
	return (
		<View style={styles.barRow}>
			<Text style={styles.barLabel}>{label}</Text>
			<TouchableOpacity
				style={styles.barButton}
				onPress={onDecrement}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel={`Зменшити ${label}`}
			>
				<MinusIcon size={10} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
			<View style={styles.barTrack}>
				<View
					style={[
						styles.barFill,
						{ backgroundColor: fillColor, width: `${pct}%` },
					]}
				/>
			</View>
			<TouchableOpacity
				style={styles.barButton}
				onPress={onIncrement}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel={`Збільшити ${label}`}
			>
				<PlusIcon size={10} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
			<Text style={styles.barValue}>
				{value} / {max}
			</Text>
		</View>
	);
}

interface TempHPBarProps {
	value: number;
	max: number;
	onChangeMax: (next: number) => void;
	onAdjust: (delta: number) => void;
}

function TempHPBar({ value, max, onChangeMax, onAdjust }: TempHPBarProps) {
	const [text, setText] = useState(String(value));
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		setText(String(value));
	}, [value]);

	const handleBlur = () => {
		setIsFocused(false);
		const trimmed = text.trim();
		if (trimmed === "") {
			onChangeMax(0);
			return;
		}
		const parsed = Number.parseInt(trimmed, 10);
		if (Number.isNaN(parsed) || parsed < 0) {
			setText(String(value));
			return;
		}
		onChangeMax(parsed);
	};

	const pct = max > 0 ? Math.round((value / max) * 100) : 0;

	return (
		<View style={styles.barRow}>
			<Text style={styles.barLabel}>TXP</Text>
			<TouchableOpacity
				style={styles.barButton}
				onPress={() => onAdjust(-1)}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Зменшити тимчасові хіт-поінти"
			>
				<MinusIcon size={10} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
			<View style={styles.barTrack}>
				<View
					style={[
						styles.barFill,
						{ backgroundColor: COLORS.azure, width: `${pct}%` },
					]}
				/>
			</View>
			<TouchableOpacity
				style={styles.barButton}
				onPress={() => onAdjust(1)}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Збільшити тимчасові хіт-поінти"
			>
				<PlusIcon size={10} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
			<TextInput
				style={[
					styles.barValueInput,
					isFocused ? styles.barValueInputFocused : styles.barValueInputIdle,
				]}
				value={text}
				onChangeText={setText}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				keyboardType="number-pad"
				maxLength={4}
				selectTextOnFocus
			/>
		</View>
	);
}

type SheetTab = "stats" | "inventory" | "spells";

const SHEET_TABS: { id: SheetTab; label: string }[] = [
	{ id: "stats", label: "Характеристики" },
	{ id: "inventory", label: "Інвентар" },
	{ id: "spells", label: "Заклинання" },
];

function SegmentedTabs({
	active,
	onSelect,
}: {
	active: SheetTab;
	onSelect: (tab: SheetTab) => void;
}) {
	return (
		<View style={styles.tabs}>
			{SHEET_TABS.map((tab) => (
				<TouchableOpacity
					key={tab.id}
					style={[styles.tab, active === tab.id && styles.tabActive]}
					onPress={() => onSelect(tab.id)}
					activeOpacity={0.8}
				>
					<Text
						style={[styles.tabText, active === tab.id && styles.tabTextActive]}
					>
						{tab.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

interface EmptyTabStateProps {
	icon: ReactNode;
	title: string;
}

function EmptyTabState({ icon, title }: EmptyTabStateProps) {
	return (
		<View style={styles.emptyTab}>
			<View style={styles.emptyTabIcon}>{icon}</View>
			<Text style={styles.emptyTabTitle}>{title}</Text>
		</View>
	);
}

export const CharacterSheet = ({ character, onClose }: Props) => {
	const { updateCharacter } = useCharacters();
	const [activeTab, setActiveTab] = useState<SheetTab>("stats");
	const [wounds, setWounds] = useState(0);
	const [tempHP, setTempHP] = useState(0);
	const [tempHPMax, setTempHPMax] = useState(0);
	const [spellPickerVisible, setSpellPickerVisible] = useState(false);
	const [itemModalVisible, setItemModalVisible] = useState(false);

	const learnedSpells = SPELLS.filter((spell) =>
		character.spells?.includes(spell.id),
	);

	const handleToggleSpell = (spellId: string) => {
		updateCharacter(character.id, (current) => {
			const existing = current.spells ?? [];
			const next = existing.includes(spellId)
				? existing.filter((id) => id !== spellId)
				: [...existing, spellId];
			return { spells: next };
		});
	};

	const handleAddItem = (name: string, quantity: number) => {
		updateCharacter(character.id, (current) => ({
			inventory: [
				...(current.inventory ?? []),
				{ id: Date.now().toString(), name, quantity },
			],
		}));
		setItemModalVisible(false);
	};

	const handleRemoveItem = (itemId: string) => {
		updateCharacter(character.id, (current) => ({
			inventory: (current.inventory ?? []).filter((item) => item.id !== itemId),
		}));
	};

	const handleSetItemQuantity = (itemId: string, quantity: number) => {
		updateCharacter(character.id, (current) => ({
			inventory: (current.inventory ?? []).map((item) =>
				item.id === itemId ? { ...item, quantity } : item,
			),
		}));
	};

	// applied against fresh state via the functional updater, not the
	// stale `value` prop the stepper rendered with — so rapid +/- taps
	// (still batched in the same render pass) don't clobber each other
	const handleAdjustItemQuantity = (itemId: string, delta: number) => {
		updateCharacter(character.id, (current) => ({
			inventory: (current.inventory ?? []).map((item) =>
				item.id === itemId
					? { ...item, quantity: Math.max(1, item.quantity + delta) }
					: item,
			),
		}));
	};

	const adjustHP = (delta: number) => {
		updateCharacter(character.id, (current) => ({
			currentHP: Math.max(
				0,
				Math.min(current.maxHP, current.currentHP + delta),
			),
		}));
	};

	const adjustWounds = (delta: number) => {
		setWounds((prev) => Math.max(0, Math.min(MAX_WOUNDS, prev + delta)));
	};

	const handleTempHPGrant = (amount: number) => {
		setTempHPMax(amount);
		setTempHP(amount);
	};

	const adjustTempHP = (delta: number) => {
		setTempHP((prev) => Math.max(0, Math.min(tempHPMax, prev + delta)));
	};

	const dexMod = character.stats.DEX;
	const defense = character.defense ?? dexMod;
	const initiative = character.initiative ?? dexMod;

	const handleDefenseChange = (next: number | null) => {
		updateCharacter(character.id, { defense: next });
	};

	const handleInitiativeChange = (next: number | null) => {
		updateCharacter(character.id, { initiative: next });
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={onClose}
					accessibilityLabel="Закрити"
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<ChevronLeftIcon
						size={20}
						color={COLORS.textMuted}
						strokeWidth={1.8}
					/>
				</TouchableOpacity>
				<Text style={styles.topBarTitle}>Лист персонажа</Text>
				<View style={styles.iconButton}>
					<SettingsIcon size={19} color={COLORS.textMuted} strokeWidth={1.6} />
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.summaryCard}>
					<View style={styles.summaryHeader}>
						<Image
							source={originImages[character.origin.id]}
							style={styles.avatar}
						/>
						<View style={styles.summaryText}>
							<Text style={styles.name}>{character.name}</Text>
							<Text style={styles.meta}>
								{character.origin.origin} ·{" "}
								{character.characterClass.background} · Рівень {character.level}
							</Text>
						</View>
					</View>

					<StatBar
						label="HP"
						value={character.currentHP}
						max={character.maxHP}
						fillColor={COLORS.crimson}
						onDecrement={() => adjustHP(-1)}
						onIncrement={() => adjustHP(1)}
					/>

					<TempHPBar
						value={tempHP}
						max={tempHPMax}
						onChangeMax={handleTempHPGrant}
						onAdjust={adjustTempHP}
					/>

					<StatBar
						label="РАНИ"
						value={wounds}
						max={MAX_WOUNDS}
						fillColor={COLORS.wound}
						onDecrement={() => adjustWounds(-1)}
						onIncrement={() => adjustWounds(1)}
					/>
				</View>

				<SegmentedTabs active={activeTab} onSelect={setActiveTab} />

				{activeTab === "stats" && (
					<>
						<View style={styles.section}>
							<View style={styles.statsGrid}>
								{STATS.map(({ code, label }) => {
									const saveMark = getSaveMark(
										character.characterClass.saves,
										code,
									);
									return (
										<View key={code} style={styles.statCard}>
											{saveMark && (
												<View
													style={[
														styles.saveBadge,
														saveMark === "up"
															? styles.saveBadgeUp
															: styles.saveBadgeDown,
													]}
												>
													{saveMark === "up" ? (
														<PlusIcon
															size={9}
															color={COLORS.onAccent}
															strokeWidth={2.6}
														/>
													) : (
														<MinusIcon
															size={9}
															color={COLORS.text}
															strokeWidth={2.6}
														/>
													)}
												</View>
											)}
											<View>
												<Text style={styles.statCode}>{code}</Text>
												<Text style={styles.statLabel}>{label}</Text>
											</View>
											<Text style={styles.statValue}>
												{formatSigned(character.stats[code])}
											</Text>
										</View>
									);
								})}
							</View>
						</View>

						{character.skills && (
							<View style={styles.derivedSection}>
								<Text style={styles.derivedTitle}>Навички</Text>
								<View style={styles.statsGrid}>
									{SKILLS.map(({ id, label, stat }) => (
										<View key={id} style={styles.statCard}>
											<View>
												<Text style={styles.statCode}>{label}</Text>
												<Text style={styles.statLabel}>{stat}</Text>
											</View>
											<Text style={styles.statValue}>
												{formatSigned(character.skills?.[id] ?? 0)}
											</Text>
										</View>
									))}
								</View>
							</View>
						)}

						<View style={styles.derivedSection}>
							<Text style={styles.derivedTitle}>Похідні показники</Text>
							<View style={styles.statsGrid}>
								<View style={styles.statCard}>
									<View>
										<Text style={styles.statCode}>КЗ</Text>
										<Text style={styles.statLabel}>Кістка здоров'я</Text>
									</View>
									<Text style={styles.statValue}>
										{character.level}d{character.characterClass.hitDie}
									</Text>
								</View>
								<EditableStatCard
									code="ЗАХ"
									label="Захист"
									value={defense}
									onChangeValue={handleDefenseChange}
								/>
								<EditableStatCard
									code="ІНІЦ"
									label="Ініціатива"
									value={initiative}
									onChangeValue={handleInitiativeChange}
								/>
							</View>
						</View>
					</>
				)}

				{activeTab === "inventory" &&
					(!character.inventory || character.inventory.length === 0 ? (
						<EmptyTabState
							icon={
								<BackpackIcon
									size={40}
									color={COLORS.accent}
									strokeWidth={1.4}
								/>
							}
							title="Твій рюкзак пустий"
						/>
					) : (
						<View style={styles.section}>
							{character.inventory.map((item) => (
								<View key={item.id} style={styles.itemRow}>
									<Text style={styles.itemName}>{item.name}</Text>
									<QuantityStepper
										value={item.quantity}
										onIncrement={() => handleAdjustItemQuantity(item.id, 1)}
										onDecrement={() => handleAdjustItemQuantity(item.id, -1)}
										onChangeValue={(next) =>
											handleSetItemQuantity(item.id, next)
										}
									/>
									<TouchableOpacity
										style={styles.deleteItemButton}
										onPress={() => handleRemoveItem(item.id)}
										hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
										accessibilityLabel={`Видалити: ${item.name}`}
									>
										<CloseIcon
											size={11}
											color={COLORS.textFaint}
											strokeWidth={1.8}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					))}

				{activeTab === "spells" &&
					(learnedSpells.length === 0 ? (
						<EmptyTabState
							icon={
								<SparkleIcon
									size={40}
									color={COLORS.accent}
									strokeWidth={1.4}
								/>
							}
							title="У тебе ще немає заклинань"
						/>
					) : (
						<View style={styles.section}>
							{learnedSpells.map((spell) => (
								<SpellRow key={spell.id} spell={spell} />
							))}
						</View>
					))}
			</ScrollView>

			{activeTab === "inventory" && (
				<TouchableOpacity
					style={styles.fab}
					onPress={() => setItemModalVisible(true)}
					activeOpacity={0.85}
					accessibilityLabel="Додати предмет"
				>
					<PlusIcon size={22} color={COLORS.onAccent} strokeWidth={2.2} />
				</TouchableOpacity>
			)}

			{activeTab === "spells" && (
				<TouchableOpacity
					style={styles.fab}
					onPress={() => setSpellPickerVisible(true)}
					activeOpacity={0.85}
					accessibilityLabel="Додати заклинання"
				>
					<PlusIcon size={22} color={COLORS.onAccent} strokeWidth={2.2} />
				</TouchableOpacity>
			)}

			<SpellPickerModal
				visible={spellPickerVisible}
				selectedIds={character.spells ?? []}
				onToggleSpell={handleToggleSpell}
				onClose={() => setSpellPickerVisible(false)}
			/>

			<AddItemModal
				visible={itemModalVisible}
				onClose={() => setItemModalVisible(false)}
				onSubmit={handleAddItem}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},

	topBar: {
		paddingTop: 12,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconButton: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	topBarTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		letterSpacing: 1,
		textTransform: "uppercase",
		color: COLORS.textMuted,
	},

	scrollContent: {
		paddingHorizontal: 20,
		paddingBottom: 40,
	},

	summaryCard: {
		marginTop: 14,
		padding: 14,
		borderRadius: RADII.xxl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		gap: 12,
	},
	summaryHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	avatar: {
		width: 58,
		height: 58,
		borderRadius: 29,
		borderWidth: 2,
		borderColor: COLORS.accent,
	},
	summaryText: {
		flex: 1,
		gap: 2,
		minWidth: 0,
	},
	name: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 17,
		color: COLORS.text,
	},
	meta: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12,
		color: COLORS.textMuted,
	},

	barRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	barLabel: {
		width: 34,
		fontFamily: FONTS.bodyBold,
		fontSize: 10,
		letterSpacing: 0.5,
		color: COLORS.textFaint,
	},
	barButton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	barTrack: {
		flex: 1,
		height: 7,
		borderRadius: 4,
		backgroundColor: COLORS.bgElev2,
		overflow: "hidden",
	},
	barFill: {
		height: "100%",
		borderRadius: 4,
	},
	barValue: {
		width: 48,
		textAlign: "right",
		fontFamily: FONTS.bodyRegular,
		fontSize: 11,
		color: COLORS.textMuted,
	},
	barValueInput: {
		width: 48,
		textAlign: "right",
		fontFamily: FONTS.bodyBold,
		fontSize: 12,
		color: COLORS.azure,
		paddingHorizontal: 0,
		paddingVertical: 2,
		borderBottomWidth: 1.5,
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	barValueInputIdle: {
		borderStyle: "dashed",
		borderBottomColor: COLORS.accentSoft35,
	},
	barValueInputFocused: {
		borderStyle: "solid",
		borderBottomColor: COLORS.accent,
	},

	tabs: {
		flexDirection: "row",
		marginTop: 14,
		padding: 3,
		gap: 3,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
	},
	tab: {
		flex: 1,
		paddingVertical: 9,
		borderRadius: 9,
		alignItems: "center",
		justifyContent: "center",
	},
	tabActive: {
		backgroundColor: COLORS.accent,
	},
	tabText: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12.5,
		color: COLORS.textMuted,
	},
	tabTextActive: {
		color: COLORS.onAccent,
	},

	section: {
		marginTop: 16,
		gap: 10,
	},

	emptyTab: {
		marginTop: 40,
		alignItems: "center",
		gap: 16,
	},
	emptyTabIcon: {
		width: 84,
		height: 84,
		borderRadius: 42,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyTabTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 16,
		color: COLORS.text,
		textAlign: "center",
	},
	fab: {
		position: "absolute",
		right: 20,
		bottom: 24,
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},

	derivedSection: {
		marginTop: 30,
		paddingTop: 18,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
		gap: 10,
	},
	derivedTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},

	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	statCard: {
		width: "47%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		padding: 12,
		backgroundColor: COLORS.bgElev,
	},
	saveBadge: {
		position: "absolute",
		top: -7,
		right: -7,
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 1.5,
		borderColor: COLORS.bg,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},
	saveBadgeUp: {
		backgroundColor: COLORS.accent,
	},
	saveBadgeDown: {
		backgroundColor: COLORS.crimson,
	},
	statCode: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 11,
		letterSpacing: 0.5,
		color: COLORS.textFaint,
	},
	statLabel: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10.5,
		color: COLORS.textMuted,
		marginTop: 1,
	},
	statValue: {
		fontFamily: FONTS.bodyBold,
		fontSize: 20,
		color: COLORS.text,
	},
	statValueInput: {
		fontFamily: FONTS.bodyBold,
		fontSize: 20,
		color: COLORS.accent,
		textAlign: "right",
		minWidth: 44,
		paddingHorizontal: 0,
		paddingVertical: 2,
		borderBottomWidth: 1.5,
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	statValueInputIdle: {
		borderStyle: "dashed",
		borderBottomColor: COLORS.accentSoft35,
	},
	statValueInputFocused: {
		borderStyle: "solid",
		borderBottomColor: COLORS.accent,
	},

	itemRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		padding: 12,
		backgroundColor: COLORS.bgElev,
	},
	itemName: {
		flex: 1,
		fontFamily: FONTS.bodySemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	deleteItemButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.bgElev2,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
});
