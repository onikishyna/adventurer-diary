import { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { Character } from "@/entities/character/types";
import {
	type ClassChoice,
	heroes,
	SKILL_POINT_LEVELS,
	STAT_INCREASES,
	type Stat,
	SUBCLASS_LEVEL,
} from "@/entities/character-classes";
import { SKILLS, type Skill } from "@/entities/skill";
import { getBonusSources, sumSkillBonus } from "@/features/characters/bonuses";
import { COLORS, FONTS, RADII } from "@/shared/theme";

export interface LevelUpResult {
	hpGain: number;
	skill?: Skill;
	stats: Stat[];
	subclassId?: string;
	choicePicks: Record<string, string[]>;
}

const formatSigned = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

const ALL_STATS: Stat[] = ["STR", "DEX", "INT", "WIL"];

const STAT_STEP_TEXT = {
	key: {
		label: "Ключова характеристика",
		message: "Обери ключову характеристику, яка отримує +1.",
	},
	secondary: {
		label: "Другорядна характеристика",
		message: "Обери другорядну характеристику, яка отримує +1.",
	},
	any: {
		label: "Характеристики",
		message: "Обери дві різні характеристики, кожна отримує +1.",
	},
} as const;

const STAT_LABELS: Record<Stat, string> = {
	STR: "Сила",
	DEX: "Спритність",
	INT: "Інтелект",
	WIL: "Воля",
};

interface LevelUpModalProps {
	visible: boolean;
	character: Character;
	onClose: () => void;
	onApply: (result: LevelUpResult) => void;
}

type Step =
	| { kind: "hp"; label: string }
	| { kind: "skills"; label: string }
	| { kind: "stat"; label: string }
	| { kind: "subclass"; label: string }
	| { kind: "choice"; label: string; choice: ClassChoice };

export function LevelUpModal({
	visible,
	character,
	onClose,
	onApply,
}: LevelUpModalProps) {
	const [stepIndex, setStepIndex] = useState(0);
	const [hpText, setHpText] = useState("");
	const [skill, setSkill] = useState<Skill | null>(null);
	const [stats, setStats] = useState<Stat[]>([]);
	const [subclassId, setSubclassId] = useState<string | null>(null);
	const [choicePicks, setChoicePicks] = useState<Record<string, string[]>>({});

	const reset = () => {
		setStepIndex(0);
		setHpText("");
		setSkill(null);
		setStats([]);
		setSubclassId(null);
		setChoicePicks({});
	};

	const nextLevel = character.level + 1;
	const classRules = heroes.find(
		(hero) => hero.id === character.characterClass.id,
	);
	const subclasses = classRules?.subclasses ?? [];
	const pickCount = (choice: ClassChoice) =>
		(choice.levels.includes(nextLevel)
			? (choice.countAt?.[nextLevel] ?? 1)
			: 0) +
		(choice.subclassCountAt?.[character.subclassId ?? ""]?.[nextLevel] ?? 0);
	const levelChoices = (classRules?.choices ?? []).filter(
		(choice) => pickCount(choice) > 0,
	);
	const keyStats = classRules?.keyStats ?? character.characterClass.keyStats;
	const statIncrease = STAT_INCREASES[nextLevel];
	const statPool: Stat[] = !statIncrease
		? []
		: statIncrease.pool === "key"
			? keyStats
			: statIncrease.pool === "secondary"
				? ALL_STATS.filter((id) => !keyStats.includes(id))
				: ALL_STATS;
	const steps: Step[] = [
		{ kind: "hp", label: "Здоров'я" },
		...(SKILL_POINT_LEVELS.includes(nextLevel)
			? [{ kind: "skills" as const, label: "Навички" }]
			: []),
		...(statIncrease
			? [
					{
						kind: "stat" as const,
						label: STAT_STEP_TEXT[statIncrease.pool].label,
					},
				]
			: []),
		...(nextLevel === SUBCLASS_LEVEL && subclasses.length > 0
			? [{ kind: "subclass" as const, label: "Підклас" }]
			: []),
		...levelChoices.map((choice) => ({
			kind: "choice" as const,
			label: choice.label,
			choice,
		})),
	];

	const handleClose = () => {
		reset();
		onClose();
	};

	const hpGain = Number.parseInt(hpText.trim(), 10);
	const isValidHpGain = /^\d+$/.test(hpText.trim()) && hpGain > 0;

	const step = steps[stepIndex];
	const isLastStep = stepIndex === steps.length - 1;
	const canContinue =
		step.kind === "hp"
			? isValidHpGain
			: step.kind === "skills"
				? skill !== null
				: step.kind === "stat"
					? stats.length === statIncrease?.count
					: step.kind === "subclass"
						? subclassId !== null
						: (choicePicks[step.choice.id]?.length ?? 0) ===
							pickCount(step.choice);

	const handleNext = () => {
		if (!canContinue) return;
		if (!isLastStep) {
			setStepIndex((prev) => prev + 1);
			return;
		}
		onApply({
			hpGain,
			skill: skill ?? undefined,
			stats,
			subclassId: subclassId ?? undefined,
			choicePicks,
		});
		reset();
	};

	const toggleStat = (id: Stat) => {
		const count = statIncrease?.count ?? 1;
		setStats((prev) => {
			if (prev.includes(id)) return prev.filter((picked) => picked !== id);
			if (count === 1) return [id];
			return prev.length < count ? [...prev, id] : prev;
		});
	};

	const toggleChoicePick = (choice: ClassChoice, optionId: string) => {
		const count = pickCount(choice);
		setChoicePicks((prev) => {
			const current = prev[choice.id] ?? [];
			const next = current.includes(optionId)
				? current.filter((picked) => picked !== optionId)
				: count === 1
					? [optionId]
					: current.length < count
						? [...current, optionId]
						: current;
			return { ...prev, [choice.id]: next };
		});
	};

	const handleSecondary = () => {
		if (stepIndex === 0) {
			handleClose();
		} else {
			setStepIndex((prev) => prev - 1);
		}
	};

	const bonusSources = getBonusSources(character);
	const skillValue = (id: Skill, stat: keyof Character["stats"]) => {
		const backgroundBonus =
			character.background.bonuses?.skill === id
				? (character.background.bonuses.skillBonus ?? 0)
				: 0;
		return (
			(character.skills?.[id] ?? character.stats[stat]) +
			backgroundBonus +
			sumSkillBonus(bonusSources, id)
		);
	};

	const hitDie = character.characterClass.hitDie;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.stepLabel}>
							Крок {stepIndex + 1} з {steps.length} · {step.label}
						</Text>
						<Text style={styles.title}>
							Рівень {character.level} → {nextLevel}
						</Text>
					</View>

					{step.kind === "hp" && (
						<>
							<Text style={styles.message}>
								Кинь кістку здоров'я (d{hitDie}) і введи, скільки HP отримує
								персонаж.
							</Text>

							<TextInput
								style={styles.input}
								placeholder={`Результат d${hitDie}`}
								placeholderTextColor={COLORS.textFaint}
								value={hpText}
								onChangeText={setHpText}
								keyboardType="number-pad"
								maxLength={3}
								autoFocus
							/>

							<View style={styles.previewCard}>
								<Text style={styles.previewLabel}>Макс. HP</Text>
								<View style={styles.previewValues}>
									<Text style={styles.previewOld}>{character.maxHP}</Text>
									<Text style={styles.previewArrow}>→</Text>
									<Text
										style={[
											styles.previewNew,
											!isValidHpGain && styles.previewNewPending,
										]}
									>
										{isValidHpGain ? character.maxHP + hpGain : "?"}
									</Text>
								</View>
							</View>
						</>
					)}

					{step.kind === "skills" && (
						<>
							<Text style={styles.message}>Обери навичку, яка отримує +1.</Text>

							<ScrollView
								style={styles.skillList}
								contentContainerStyle={styles.skillListContent}
								showsVerticalScrollIndicator={false}
							>
								{SKILLS.map(({ id, label, stat }) => {
									const isSelected = skill === id;
									const value = skillValue(id, stat);
									return (
										<TouchableOpacity
											key={id}
											style={[
												styles.skillRow,
												isSelected && styles.skillRowSelected,
											]}
											onPress={() => setSkill(isSelected ? null : id)}
											activeOpacity={0.75}
											role="radio"
											aria-checked={isSelected}
											accessibilityLabel={label}
										>
											<View style={styles.skillInfo}>
												<Text style={styles.skillName}>{label}</Text>
												<Text style={styles.skillStat}>{stat}</Text>
											</View>
											<Text style={styles.skillValue}>
												{formatSigned(value)}
											</Text>
											{isSelected && (
												<>
													<Text style={styles.previewArrow}>→</Text>
													<Text style={styles.skillValueNew}>
														{formatSigned(value + 1)}
													</Text>
												</>
											)}
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</>
					)}

					{step.kind === "stat" && statIncrease && (
						<>
							<Text style={styles.message}>
								{STAT_STEP_TEXT[statIncrease.pool].message}
							</Text>

							<View style={styles.skillListContent}>
								{statPool.map((id) => {
									const isSelected = stats.includes(id);
									const value = character.stats[id];
									return (
										<TouchableOpacity
											key={id}
											style={[
												styles.skillRow,
												isSelected && styles.skillRowSelected,
											]}
											onPress={() => toggleStat(id)}
											activeOpacity={0.75}
											role={statIncrease.count > 1 ? "checkbox" : "radio"}
											aria-checked={isSelected}
											accessibilityLabel={STAT_LABELS[id]}
										>
											<View style={styles.skillInfo}>
												<Text style={styles.skillName}>{id}</Text>
												<Text style={styles.skillStat}>{STAT_LABELS[id]}</Text>
											</View>
											<Text style={styles.skillValue}>
												{formatSigned(value)}
											</Text>
											{isSelected && (
												<>
													<Text style={styles.previewArrow}>→</Text>
													<Text style={styles.skillValueNew}>
														{formatSigned(value + 1)}
													</Text>
												</>
											)}
										</TouchableOpacity>
									);
								})}
							</View>
						</>
					)}

					{step.kind === "subclass" && (
						<>
							<Text style={styles.message}>
								Обери підклас. Вибір робиться один раз.
							</Text>

							<ScrollView
								style={styles.skillList}
								contentContainerStyle={styles.subclassListContent}
								showsVerticalScrollIndicator={false}
							>
								{subclasses.map((subclass) => {
									const isSelected = subclassId === subclass.id;
									return (
										<TouchableOpacity
											key={subclass.id}
											style={[
												styles.subclassCard,
												isSelected && styles.skillRowSelected,
											]}
											onPress={() =>
												setSubclassId(isSelected ? null : subclass.id)
											}
											activeOpacity={0.8}
											role="radio"
											aria-checked={isSelected}
											accessibilityLabel={subclass.name}
										>
											<Text
												style={[
													styles.subclassName,
													isSelected && styles.subclassNameSelected,
												]}
											>
												{subclass.name}
											</Text>
											<Text style={styles.subclassTagline}>
												{subclass.tagline}
											</Text>
											{subclass.features.map((feature) => {
												const isFuture = (feature.minLevel ?? 1) > nextLevel;
												return (
													<View
														key={feature.title}
														style={[
															styles.subclassFeature,
															isFuture && styles.subclassFeatureFuture,
														]}
													>
														<View style={styles.subclassFeatureHeader}>
															<Text style={styles.subclassFeatureTitle}>
																{feature.title}
															</Text>
															{isFuture && (
																<Text style={styles.subclassFeatureLevel}>
																	Рів. {feature.minLevel}
																</Text>
															)}
														</View>
														{feature.lines.map((line) => (
															<Text
																key={line}
																style={styles.subclassFeatureText}
															>
																{line}
															</Text>
														))}
													</View>
												);
											})}
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</>
					)}

					{step.kind === "choice" && (
						<>
							<Text style={styles.message}>
								{pickCount(step.choice) > 1
									? `Обери ${pickCount(step.choice)}: ${step.choice.sectionTitle}.`
									: `Обери: ${step.choice.label}.`}
							</Text>

							<ScrollView
								style={styles.skillList}
								contentContainerStyle={styles.skillListContent}
								showsVerticalScrollIndicator={false}
							>
								{step.choice.options
									.filter(
										(option) =>
											!character.choices?.[step.choice.id]?.includes(option.id),
									)
									.map((option) => {
										const isSelected =
											choicePicks[step.choice.id]?.includes(option.id) ?? false;
										return (
											<TouchableOpacity
												key={option.id}
												style={[
													styles.optionCard,
													isSelected && styles.skillRowSelected,
												]}
												onPress={() => toggleChoicePick(step.choice, option.id)}
												activeOpacity={0.8}
												role={pickCount(step.choice) > 1 ? "checkbox" : "radio"}
												aria-checked={isSelected}
												accessibilityLabel={option.title}
											>
												<Text
													style={[
														styles.subclassFeatureTitle,
														!isSelected && styles.optionTitleIdle,
													]}
												>
													{option.title}
												</Text>
												{option.lines.map((line) => (
													<Text key={line} style={styles.subclassFeatureText}>
														{line}
													</Text>
												))}
											</TouchableOpacity>
										);
									})}
							</ScrollView>
						</>
					)}

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={handleSecondary}
							activeOpacity={0.8}
						>
							<Text style={styles.cancelText}>
								{stepIndex === 0 ? "Скасувати" : "Назад"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.confirmButton,
								!canContinue && styles.confirmButtonDisabled,
							]}
							onPress={handleNext}
							activeOpacity={0.85}
							disabled={!canContinue}
						>
							<Text style={styles.confirmText}>
								{isLastStep ? "Левел ап" : "Далі"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(8,4,2,0.72)",
		alignItems: "center",
		justifyContent: "center",
		padding: 28,
	},
	card: {
		width: "100%",
		maxWidth: 340,
		maxHeight: "90%",
		borderRadius: RADII.xxl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		padding: 22,
		gap: 14,
	},
	header: {
		gap: 4,
	},
	stepLabel: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 11,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},
	title: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 18,
		color: COLORS.text,
	},
	message: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13.5,
		color: COLORS.textMuted,
		lineHeight: 20,
	},
	input: {
		height: 46,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		backgroundColor: COLORS.bgElev2,
		paddingHorizontal: 14,
		fontFamily: FONTS.bodyRegular,
		fontSize: 14,
		color: COLORS.text,
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	previewCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	previewLabel: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},
	previewValues: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	previewOld: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 15,
		color: COLORS.textMuted,
	},
	previewArrow: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 15,
		color: COLORS.textFaint,
	},
	previewNew: {
		fontFamily: FONTS.bodyBold,
		fontSize: 17,
		color: COLORS.accent,
	},
	previewNewPending: {
		color: COLORS.textFaint,
	},
	skillList: {
		flexShrink: 1,
	},
	skillListContent: {
		gap: 6,
	},
	skillRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: COLORS.bgElev2,
	},
	skillRowSelected: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accentSoft10,
	},
	skillInfo: {
		flex: 1,
		flexDirection: "row",
		alignItems: "baseline",
		gap: 8,
		minWidth: 0,
	},
	skillName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	skillStat: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10.5,
		letterSpacing: 0.5,
		color: COLORS.textFaint,
	},
	subclassListContent: {
		gap: 10,
	},
	subclassCard: {
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		padding: 14,
		backgroundColor: COLORS.bgElev2,
		gap: 8,
	},
	subclassName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.text,
	},
	subclassNameSelected: {
		color: COLORS.accent,
	},
	subclassTagline: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		fontStyle: "italic",
		color: COLORS.textMuted,
		lineHeight: 19,
	},
	subclassFeature: {
		gap: 3,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
	},
	subclassFeatureFuture: {
		opacity: 0.55,
	},
	subclassFeatureHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: 8,
	},
	subclassFeatureTitle: {
		flexShrink: 1,
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12.5,
		color: COLORS.accent,
	},
	subclassFeatureLevel: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		marginTop: 1,
	},
	optionCard: {
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: COLORS.bgElev2,
		gap: 4,
	},
	optionTitleIdle: {
		color: COLORS.text,
	},
	subclassFeatureText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.textMuted,
		lineHeight: 18,
	},
	skillValue: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: COLORS.textMuted,
	},
	skillValueNew: {
		fontFamily: FONTS.bodyBold,
		fontSize: 15,
		color: COLORS.accent,
	},
	actions: {
		flexDirection: "row",
		gap: 10,
		marginTop: 4,
	},
	cancelButton: {
		flex: 1,
		height: 46,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	cancelText: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 14,
		color: COLORS.textMuted,
	},
	confirmButton: {
		flex: 1,
		height: 46,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},
	confirmButtonDisabled: {
		opacity: 0.4,
	},
	confirmText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.onAccent,
		letterSpacing: 0.3,
	},
});
