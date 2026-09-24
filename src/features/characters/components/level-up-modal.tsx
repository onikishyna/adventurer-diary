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
import { heroes, SUBCLASS_LEVEL } from "@/entities/character-classes";
import { SKILLS, type Skill } from "@/entities/skill";
import { COLORS, FONTS, RADII } from "@/shared/theme";

export interface LevelUpResult {
	hpGain: number;
	// the skill that receives this level's single skill point
	skill: Skill;
	// set only on the level-up that reaches SUBCLASS_LEVEL
	subclassId?: string;
}

const formatSigned = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

interface LevelUpModalProps {
	visible: boolean;
	character: Character;
	onClose: () => void;
	onApply: (result: LevelUpResult) => void;
}

type StepId = "hp" | "skills" | "subclass";

// the level-up flow is a sequence of steps, rendered by id below; the
// common ones run every level, level-specific ones are appended per level
const STEP_LABELS: Record<StepId, string> = {
	hp: "Здоров'я",
	skills: "Навички",
	subclass: "Підклас",
};

export function LevelUpModal({
	visible,
	character,
	onClose,
	onApply,
}: LevelUpModalProps) {
	const [stepIndex, setStepIndex] = useState(0);
	const [hpText, setHpText] = useState("");
	const [skill, setSkill] = useState<Skill | null>(null);
	const [subclassId, setSubclassId] = useState<string | null>(null);

	const reset = () => {
		setStepIndex(0);
		setHpText("");
		setSkill(null);
		setSubclassId(null);
	};

	const nextLevel = character.level + 1;
	// read from the static data — the class stored on the character is a
	// snapshot from creation and may predate subclasses
	const subclasses =
		heroes.find((hero) => hero.id === character.characterClass.id)
			?.subclasses ?? [];
	const steps: StepId[] = [
		"hp",
		"skills",
		...(nextLevel === SUBCLASS_LEVEL && subclasses.length > 0
			? (["subclass"] as const)
			: []),
	];

	const handleClose = () => {
		reset();
		onClose();
	};

	// players roll the hit die themselves, so the gain is entered by hand
	const hpGain = Number.parseInt(hpText.trim(), 10);
	const isValidHpGain = /^\d+$/.test(hpText.trim()) && hpGain > 0;

	const step = steps[stepIndex];
	const isLastStep = stepIndex === steps.length - 1;
	const canContinue = {
		hp: isValidHpGain,
		skills: skill !== null,
		subclass: subclassId !== null,
	}[step];

	const handleNext = () => {
		if (!canContinue) return;
		if (!isLastStep) {
			setStepIndex((prev) => prev + 1);
			return;
		}
		if (skill === null) return;
		onApply({ hpGain, skill, subclassId: subclassId ?? undefined });
		reset();
	};

	// the first step's secondary button cancels, later ones go back a step
	const handleSecondary = () => {
		if (stepIndex === 0) {
			handleClose();
		} else {
			setStepIndex((prev) => prev - 1);
		}
	};

	// same displayed value as the sheet: stored skill (falls back to the
	// governing stat for characters created before skills existed) plus
	// the background's flat bonus
	const skillValue = (id: Skill, stat: keyof Character["stats"]) => {
		const backgroundBonus =
			character.background.bonuses?.skill === id
				? (character.background.bonuses.skillBonus ?? 0)
				: 0;
		return (character.skills?.[id] ?? character.stats[stat]) + backgroundBonus;
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
							Крок {stepIndex + 1} з {steps.length} · {STEP_LABELS[step]}
						</Text>
						<Text style={styles.title}>
							Рівень {character.level} → {nextLevel}
						</Text>
					</View>

					{step === "hp" && (
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

					{step === "skills" && (
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

					{step === "subclass" && (
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
											{subclass.features.map((feature) => (
												<View
													key={feature.title}
													style={styles.subclassFeature}
												>
													<Text style={styles.subclassFeatureTitle}>
														{feature.title}
													</Text>
													{feature.lines.map((line) => (
														<Text key={line} style={styles.subclassFeatureText}>
															{line}
														</Text>
													))}
												</View>
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
	subclassFeatureTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12.5,
		color: COLORS.accent,
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
