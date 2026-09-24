import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { originIcons, originImages } from "@/entities/ancestry";
import type { Character, CharacterNote } from "@/entities/character/types";
import {
	ClassFeatures,
	heroes,
	type Save,
	type Stat,
} from "@/entities/character-classes";
import { SKILLS, type Skill } from "@/entities/skill";
import { SPELLS } from "@/entities/spell";
import { AddItemModal } from "@/features/characters/components/add-item-modal";
import {
	CharacterSettingsMenu,
	type MenuAnchor,
} from "@/features/characters/components/character-settings-menu";
import { ChargeTracker } from "@/features/characters/components/charge-tracker";
import { DamageModal } from "@/features/characters/components/damage-modal";
import {
	LevelUpModal,
	type LevelUpResult,
} from "@/features/characters/components/level-up-modal";
import { QuantityStepper } from "@/features/characters/components/quantity-stepper";
import { useCharacters } from "@/features/characters/use-characters-context";
import { SpellPickerModal } from "@/features/spells/components/spell-picker-modal";
import { SpellRow } from "@/features/spells/components/spell-row";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
	BackpackIcon,
	ChevronLeftIcon,
	CloseIcon,
	type IconProps,
	MinusIcon,
	PlusIcon,
	SettingsIcon,
	ShieldIcon,
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

// before racial bonuses (e.g. Dwarf −1)
const BASE_SPEED = 6;

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
	// modifiers read as "+2"; absolute values like speed read as a plain "6"
	signed?: boolean;
}

function EditableStatCard({
	code,
	label,
	value,
	onChangeValue,
	signed = true,
}: EditableStatCardProps) {
	const format = signed ? formatSigned : String;
	const [text, setText] = useState(format(value));
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		setText(format(value));
	}, [value, format]);

	const handleBlur = () => {
		setIsFocused(false);
		const trimmed = text.trim();
		if (trimmed === "") {
			onChangeValue(null);
			return;
		}
		const parsed = Number.parseInt(trimmed, 10);
		if (Number.isNaN(parsed)) {
			setText(format(value));
			return;
		}
		onChangeValue(parsed);
		setText(format(parsed));
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

type SheetTab = "stats" | "inventory" | "spells" | "origin";

interface SheetBottomNavProps {
	active: SheetTab;
	onSelect: (tab: SheetTab) => void;
	// the "origin" tab's icon depends on the character's own race, so it's
	// passed in rather than baked into a static list
	originIcon: ComponentType<IconProps>;
}

function SheetBottomNav({ active, onSelect, originIcon }: SheetBottomNavProps) {
	const items: {
		id: SheetTab;
		label: string;
		icon: ComponentType<IconProps>;
	}[] = [
		{ id: "stats", label: "Характеристики", icon: ShieldIcon },
		{ id: "inventory", label: "Інвентар", icon: BackpackIcon },
		{ id: "spells", label: "Заклинання", icon: SparkleIcon },
		{ id: "origin", label: "Довідка", icon: originIcon },
	];

	return (
		<View style={styles.bottomNav}>
			{items.map((item) => {
				const Icon = item.icon;
				const isActive = active === item.id;
				return (
					<TouchableOpacity
						key={item.id}
						style={styles.navItem}
						activeOpacity={0.7}
						onPress={() => onSelect(item.id)}
					>
						<Icon
							size={20}
							color={isActive ? COLORS.accent : COLORS.textFaint}
							strokeWidth={1.6}
						/>
						<Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
							{item.label}
						</Text>
					</TouchableOpacity>
				);
			})}
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

interface NoteInputProps {
	value: string;
	onChangeText: (text: string) => void;
	onBlur?: () => void;
	placeholder?: string;
}

// multiline inputs don't resize to their content on web (and never shrink
// back), so an invisible Text with the same content sizes the box and the
// input is stretched over it
function NoteInput({
	value,
	onChangeText,
	onBlur,
	placeholder,
}: NoteInputProps) {
	return (
		<View style={styles.noteInputWrap}>
			<Text style={[styles.abilityText, styles.noteSizer]} aria-hidden>
				{/* trailing space keeps a final empty line from collapsing */}
				{`${value || placeholder || ""} `}
			</Text>
			<TextInput
				style={[styles.abilityText, styles.noteInput]}
				value={value}
				onChangeText={onChangeText}
				onBlur={onBlur}
				placeholder={placeholder}
				placeholderTextColor={COLORS.textFaint}
				multiline
				scrollEnabled={false}
			/>
		</View>
	);
}

interface NoteCardProps {
	note: CharacterNote;
	onChangeText: (text: string) => void;
	onDelete: () => void;
}

// edits stay local while typing and are committed on blur, so every
// keystroke doesn't round-trip through the context + AsyncStorage
function NoteCard({ note, onChangeText, onDelete }: NoteCardProps) {
	const [draft, setDraft] = useState(note.text);

	useEffect(() => {
		setDraft(note.text);
	}, [note.text]);

	const commit = () => {
		const trimmed = draft.trim();
		if (!trimmed) {
			onDelete();
		} else if (trimmed !== note.text) {
			onChangeText(trimmed);
		}
	};

	return (
		<View style={[styles.abilityCard, styles.noteCard]}>
			<NoteInput value={draft} onChangeText={setDraft} onBlur={commit} />
			<TouchableOpacity
				style={styles.deleteItemButton}
				onPress={onDelete}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Видалити нотатку"
			>
				<CloseIcon size={11} color={COLORS.textFaint} strokeWidth={1.8} />
			</TouchableOpacity>
		</View>
	);
}

function NewNoteInput({ onAdd }: { onAdd: (text: string) => void }) {
	const [text, setText] = useState("");
	const trimmed = text.trim();

	const submit = () => {
		if (!trimmed) return;
		onAdd(trimmed);
		setText("");
	};

	return (
		<View style={[styles.abilityCard, styles.noteCard, styles.newNoteCard]}>
			<NoteInput
				value={text}
				onChangeText={setText}
				placeholder="Нова нотатка…"
			/>
			<TouchableOpacity
				style={[styles.addNoteButton, !trimmed && styles.addNoteButtonDisabled]}
				onPress={submit}
				disabled={!trimmed}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Додати нотатку"
			>
				<PlusIcon size={13} color={COLORS.onAccent} strokeWidth={2.4} />
			</TouchableOpacity>
		</View>
	);
}

export const CharacterSheet = ({ character, onClose }: Props) => {
	const { updateCharacter, deleteCharacter } = useCharacters();
	const { width: windowWidth } = useWindowDimensions();
	const [activeTab, setActiveTab] = useState<SheetTab>("stats");
	const settingsButtonRef = useRef<View>(null);
	const [settingsAnchor, setSettingsAnchor] = useState<MenuAnchor | null>(null);
	const [levelUpVisible, setLevelUpVisible] = useState(false);
	const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
	const [spellPickerVisible, setSpellPickerVisible] = useState(false);
	const [itemModalVisible, setItemModalVisible] = useState(false);
	const [damageModalVisible, setDamageModalVisible] = useState(false);

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

	const openSettings = () => {
		settingsButtonRef.current?.measureInWindow((x, y, width, height) => {
			setSettingsAnchor({
				top: y + height,
				right: windowWidth - (x + width),
			});
		});
	};

	// the rolled HP raises both the max and the current pool, so a
	// character doesn't end the level-up looking "damaged"
	const handleApplyLevelUp = ({ hpGain, skill, subclassId }: LevelUpResult) => {
		updateCharacter(character.id, (current) => {
			// characters created before skills existed have none stored — seed
			// every skill from its governing stat, as creation does
			const skills =
				current.skills ??
				(Object.fromEntries(
					SKILLS.map(({ id, stat }) => [id, current.stats[stat]]),
				) as Record<Skill, number>);
			return {
				level: current.level + 1,
				maxHP: current.maxHP + hpGain,
				currentHP: current.currentHP + hpGain,
				skills: { ...skills, [skill]: skills[skill] + 1 },
				...(subclassId && { subclassId }),
			};
		});
		setLevelUpVisible(false);
	};

	// leave the sheet first — once the character is gone this screen has
	// nothing to render
	const handleConfirmDelete = () => {
		setDeleteConfirmVisible(false);
		onClose();
		deleteCharacter(character.id);
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

	const handleAddNote = (text: string) => {
		updateCharacter(character.id, (current) => ({
			notes: [...(current.notes ?? []), { id: Date.now().toString(), text }],
		}));
	};

	const handleUpdateNote = (noteId: string, text: string) => {
		updateCharacter(character.id, (current) => ({
			notes: (current.notes ?? []).map((note) =>
				note.id === noteId ? { ...note, text } : note,
			),
		}));
	};

	const handleRemoveNote = (noteId: string) => {
		updateCharacter(character.id, (current) => ({
			notes: (current.notes ?? []).filter((note) => note.id !== noteId),
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

	const applyDamage = (amount: number) => {
		updateCharacter(character.id, (current) => ({
			currentHP: Math.max(0, current.currentHP - amount),
		}));
	};

	// racial bonus (e.g. Dwarf +1 max wounds) — derived from static origin
	// data every render rather than stored on the character
	const maxWounds = MAX_WOUNDS + (character.origin.bonuses?.maxWounds ?? 0);

	const wounds = Math.min(character.wounds ?? 0, maxWounds);
	const tempHP = character.tempHP ?? 0;
	const tempHPMax = character.tempHPMax ?? 0;

	const adjustWounds = (delta: number) => {
		updateCharacter(character.id, (current) => ({
			wounds: Math.max(0, Math.min(maxWounds, (current.wounds ?? 0) + delta)),
		}));
	};

	const handleTempHPGrant = (amount: number) => {
		updateCharacter(character.id, { tempHP: amount, tempHPMax: amount });
	};

	const adjustTempHP = (delta: number) => {
		updateCharacter(character.id, (current) => ({
			tempHP: Math.max(
				0,
				Math.min(current.tempHPMax ?? 0, (current.tempHP ?? 0) + delta),
			),
		}));
	};

	const dexMod = character.stats.DEX;
	// the class is snapshotted onto the character at creation, so rules
	// added later (Zephyr's STR + DEX defense, class resources) are read
	// from the static data
	const classRules = heroes.find(
		(hero) => hero.id === character.characterClass.id,
	);
	const defenseStats = classRules?.defenseStats ?? ["DEX"];
	const subclass = classRules?.subclasses?.find(
		(option) => option.id === character.subclassId,
	);
	const resources = (classRules?.resources ?? [])
		.filter((resource) => character.level >= (resource.minLevel ?? 1))
		.map((resource) => {
			const max = Math.max(0, resource.max(character));
			return {
				...resource,
				max,
				// clamped on read, in case the max dropped below the spent count
				used: Math.min(character.usedResources?.[resource.id] ?? 0, max),
			};
		});

	const pipResources = resources.filter(
		(resource) => (resource.display ?? "pips") === "pips",
	);
	const fieldResources = resources.filter(
		(resource) => resource.display === "field",
	);

	const handleResourceUsedChange = (resourceId: string, used: number) => {
		updateCharacter(character.id, (current) => ({
			usedResources: { ...current.usedResources, [resourceId]: used },
		}));
	};

	const handleResourceValueChange = (
		resourceId: string,
		value: number | null,
	) => {
		updateCharacter(character.id, (current) => ({
			resourceValues: { ...current.resourceValues, [resourceId]: value },
		}));
	};

	// racial bonus (e.g. Dragonborn +1 defense) folds into the reactive
	// default on top of the class's stat sum
	const defenseDefault =
		defenseStats.reduce((sum, stat) => sum + character.stats[stat], 0) +
		(character.origin.bonuses?.defense ?? 0);
	const defense = character.defense ?? defenseDefault;
	const initiative = character.initiative ?? dexMod;
	// racial (Dwarf −1) and class (Zephyr +2 from level 2) bonuses form the
	// reactive default; a hand-entered value overrides it, like defense
	const speedDefault =
		BASE_SPEED +
		(character.origin.bonuses?.speed ?? 0) +
		(classRules?.speedBonus?.(character) ?? 0);
	const speed = character.speed ?? speedDefault;
	// background bonus (e.g. Виживальник +1) — the hit die *size* still
	// comes from the class, only the *count* (normally = level) grows
	const hitDiceCount =
		character.level + (character.background.bonuses?.hitDiceBonus ?? 0);

	const handleDefenseChange = (next: number | null) => {
		updateCharacter(character.id, { defense: next });
	};

	const handleInitiativeChange = (next: number | null) => {
		updateCharacter(character.id, { initiative: next });
	};

	const handleSpeedChange = (next: number | null) => {
		updateCharacter(character.id, { speed: next });
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
				<TouchableOpacity
					ref={settingsButtonRef}
					style={styles.iconButton}
					onPress={openSettings}
					accessibilityLabel="Налаштування персонажа"
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<SettingsIcon size={19} color={COLORS.textMuted} strokeWidth={1.6} />
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* HP & co. only on the first tab — the others need the room */}
				{activeTab === "stats" && (
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
									{character.characterClass.background} · Рівень{" "}
									{character.level}
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

						<TouchableOpacity
							style={styles.damageButton}
							onPress={() => setDamageModalVisible(true)}
							activeOpacity={0.8}
							accessibilityLabel="Нанести урон"
						>
							<Text style={styles.damageButtonText}>Нанести урон</Text>
						</TouchableOpacity>

						<TempHPBar
							value={tempHP}
							max={tempHPMax}
							onChangeMax={handleTempHPGrant}
							onAdjust={adjustTempHP}
						/>

						<StatBar
							label="РАНИ"
							value={wounds}
							max={maxWounds}
							fillColor={COLORS.wound}
							onDecrement={() => adjustWounds(-1)}
							onIncrement={() => adjustWounds(1)}
						/>
					</View>
				)}

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
									{SKILLS.map(({ id, label, stat }) => {
										const backgroundBonus =
											character.background.bonuses?.skill === id
												? (character.background.bonuses.skillBonus ?? 0)
												: 0;
										return (
											<View key={id} style={styles.statCard}>
												<View>
													<Text style={styles.statCode}>{label}</Text>
													<Text style={styles.statLabel}>{stat}</Text>
												</View>
												<Text style={styles.statValue}>
													{formatSigned(
														(character.skills?.[id] ?? 0) + backgroundBonus,
													)}
												</Text>
											</View>
										);
									})}
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
										{hitDiceCount}d{character.characterClass.hitDie}
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
								<EditableStatCard
									code="ШВИД"
									label="Швидкість"
									value={speed}
									signed={false}
									onChangeValue={handleSpeedChange}
								/>
								{fieldResources.map((resource) => (
									<EditableStatCard
										key={resource.id}
										code={resource.code ?? resource.label}
										label={resource.label}
										value={
											character.resourceValues?.[resource.id] ?? resource.max
										}
										signed={false}
										onChangeValue={(next) =>
											handleResourceValueChange(resource.id, next)
										}
									/>
								))}
							</View>
						</View>

						{pipResources.map((resource) => (
							<View key={resource.id} style={styles.derivedSection}>
								<ChargeTracker
									title={resource.label}
									max={resource.max}
									used={resource.used}
									onChangeUsed={(next) =>
										handleResourceUsedChange(resource.id, next)
									}
								/>
							</View>
						))}
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

				{activeTab === "origin" && (
					<View style={styles.section}>
						<Text style={styles.derivedTitle}>Раса</Text>
						<Text style={styles.originMeta}>
							{character.origin.origin} · {character.origin.size}
						</Text>
						<Text style={styles.originDescription}>
							{character.origin.description}
						</Text>
						<View style={styles.abilityCard}>
							<Text style={styles.abilityTitle}>
								{character.origin.ability[0]}
							</Text>
							{character.origin.ability.slice(1).map((line) => (
								<Text key={line} style={styles.abilityText}>
									{line}
								</Text>
							))}
						</View>

						<Text style={[styles.derivedTitle, styles.originSectionSpacing]}>
							Передісторія
						</Text>
						<Text style={styles.originMeta}>{character.background.title}</Text>
						<Text style={styles.originDescription}>
							{character.background.description}
						</Text>

						{classRules && (
							<>
								<Text
									style={[styles.derivedTitle, styles.originSectionSpacing]}
								>
									Клас
								</Text>
								<Text style={styles.originMeta}>{classRules.background}</Text>
								<ClassFeatures
									features={classRules.features}
									level={character.level}
								/>

								{subclass && (
									<>
										<Text
											style={[styles.derivedTitle, styles.originSectionSpacing]}
										>
											Підклас
										</Text>
										<Text style={styles.originMeta}>{subclass.name}</Text>
										<Text style={styles.originDescription}>
											{subclass.tagline}
										</Text>
										<ClassFeatures
											features={subclass.features}
											level={character.level}
										/>
									</>
								)}
							</>
						)}

						<Text style={[styles.derivedTitle, styles.originSectionSpacing]}>
							Нотатки
						</Text>
						{character.notes?.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onChangeText={(text) => handleUpdateNote(note.id, text)}
								onDelete={() => handleRemoveNote(note.id)}
							/>
						))}
						<NewNoteInput onAdd={handleAddNote} />
					</View>
				)}
			</ScrollView>

			<SheetBottomNav
				active={activeTab}
				onSelect={setActiveTab}
				originIcon={originIcons[character.origin.id] ?? ShieldIcon}
			/>

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

			<CharacterSettingsMenu
				anchor={settingsAnchor}
				onClose={() => setSettingsAnchor(null)}
				onLevelUp={() => {
					setSettingsAnchor(null);
					setLevelUpVisible(true);
				}}
				onDelete={() => {
					setSettingsAnchor(null);
					setDeleteConfirmVisible(true);
				}}
			/>

			<LevelUpModal
				visible={levelUpVisible}
				character={character}
				onClose={() => setLevelUpVisible(false)}
				onApply={handleApplyLevelUp}
			/>

			<ConfirmDialog
				visible={deleteConfirmVisible}
				title="Видалити персонажа?"
				message={`«${character.name}» буде видалено назавжди. Цю дію не можна скасувати.`}
				confirmLabel="Видалити"
				destructive
				onConfirm={handleConfirmDelete}
				onCancel={() => setDeleteConfirmVisible(false)}
			/>

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

			<DamageModal
				visible={damageModalVisible}
				defense={defense}
				onClose={() => setDamageModalVisible(false)}
				onApply={(finalDamage) => {
					applyDamage(finalDamage);
					setDamageModalVisible(false);
				}}
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

	damageButton: {
		alignSelf: "flex-end",
		paddingVertical: 5,
		paddingHorizontal: 12,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.crimson,
	},
	damageButtonText: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.crimson,
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
		// clears the fixed bottom nav bar below it
		bottom: 90,
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

	originSectionSpacing: {
		marginTop: 20,
		paddingTop: 18,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
	},
	originMeta: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},
	originDescription: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13.5,
		color: COLORS.textMuted,
		lineHeight: 21,
	},
	abilityCard: {
		marginTop: 4,
		padding: 14,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		gap: 6,
	},
	abilityTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.accent,
	},
	abilityText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		lineHeight: 19,
	},

	noteCard: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
	},
	newNoteCard: {
		borderStyle: "dashed",
		borderColor: COLORS.border,
		backgroundColor: "transparent",
	},
	noteInputWrap: {
		flex: 1,
	},
	noteSizer: {
		opacity: 0,
	},
	noteInput: {
		...StyleSheet.absoluteFill,
		padding: 0,
		textAlignVertical: "top",
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	addNoteButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	addNoteButtonDisabled: {
		opacity: 0.35,
	},
});
