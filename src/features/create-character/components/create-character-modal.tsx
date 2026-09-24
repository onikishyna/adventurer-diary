import type { ReactNode } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { originIcons } from "@/entities/ancestry";
import { classIcons } from "@/entities/character-classes";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PersonIcon,
	QuestBookIcon,
} from "@/shared/ui/icons";
import { STEPS, useCharacterDraft } from "../hooks/use-character-draft";
import type { CharacterDraft, CreationStep } from "../types";
import {
	StepBackground,
	StepClass,
	StepInput,
	StepOrigin,
	StepSkills,
	StepStats,
	StepSummary,
} from "./steps";

interface CreateCharacterModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (draft: CharacterDraft) => void;
}

interface StepContentProps {
	step: CreationStep;
	draft: CharacterDraft;
	onUpdate: (patch: Partial<CharacterDraft>) => void;
}

const STEP_META: Record<
	CreationStep,
	{ section: string; title: string; description: string; nextLabel: string }
> = {
	name: {
		section: "Ім'я",
		title: "Назвіть персонажа",
		description:
			"Це ім'я супроводжуватиме вашого героя протягом усієї пригоди.",
		nextLabel: "Далі: Раса",
	},
	origin: {
		section: "Раса",
		title: "Оберіть расу",
		description:
			"Раса визначає стартові риси, бонуси характеристик та вроджені здібності персонажа.",
		nextLabel: "Далі: Передісторія",
	},
	background: {
		section: "Передісторія",
		title: "Оберіть передісторію",
		description:
			"Передісторія додає особливі риси та деталі минулого персонажа.",
		nextLabel: "Далі: Клас",
	},
	class: {
		section: "Клас",
		title: "Оберіть клас",
		description:
			"Клас визначає бойовий стиль, здібності та шлях розвитку персонажа.",
		nextLabel: "Далі: Характеристики",
	},
	stats: {
		section: "Характеристики",
		title: "Розподіліть характеристики",
		description: "Розподіліть очки між силою, спритністю, інтелектом та волею.",
		nextLabel: "Далі: Навички",
	},
	skills: {
		section: "Навички",
		title: "Розподіліть навички",
		description:
			"Базові значення навичок визначаються характеристиками. Розподіліть 4 вільні очки на власний розсуд.",
		nextLabel: "Далі: Огляд",
	},
	summary: {
		section: "Огляд",
		title: "Огляд персонажа",
		description: "Перевірте деталі персонажа перед тим, як розпочати пригоду.",
		nextLabel: "Створити персонажа",
	},
};

const MIN_NAME_LENGTH = 2;

function isStepValid(step: CreationStep, draft: CharacterDraft): boolean {
	switch (step) {
		case "name":
			return draft.name.trim().length >= MIN_NAME_LENGTH;
		case "origin":
			return draft.origin !== null;
		case "background":
			return draft.background !== null;
		case "class":
			return draft.characterClass !== null;
		case "stats":
			return draft.stats !== null;
		case "skills":
			return draft.skills !== null;
		case "summary":
			return true;
	}
}

function StepContent({ step, draft, onUpdate }: StepContentProps) {
	switch (step) {
		case "name":
			return (
				<StepInput value={draft.name} onChange={(name) => onUpdate({ name })} />
			);
		case "origin":
			return (
				<StepOrigin
					value={draft.origin}
					onChange={(origin) => onUpdate({ origin })}
				/>
			);
		case "background":
			return (
				<StepBackground
					value={draft.background}
					onChange={(background) => onUpdate({ background })}
				/>
			);
		case "class":
			return (
				<StepClass
					value={draft.characterClass}
					onChange={(characterClass) => onUpdate({ characterClass })}
				/>
			);
		case "stats":
			return (
				<StepStats
					value={draft.stats}
					onChange={(stats) => onUpdate({ stats })}
				/>
			);
		case "skills":
			return (
				<StepSkills
					stats={draft.stats ?? { STR: 0, DEX: 0, INT: 0, WIL: 0 }}
					value={draft.skills}
					onChange={(skills) => onUpdate({ skills })}
					background={draft.background}
				/>
			);
		case "summary":
			return <StepSummary draft={draft} />;
	}
}

function FooterConfirmation({
	step,
	draft,
}: {
	step: CreationStep;
	draft: CharacterDraft;
}) {
	switch (step) {
		case "name": {
			return (
				<ConfirmationRow
					icon={
						<PersonIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
					}
					text={
						<>
							Ім'я персонажа:{" "}
							<Text style={styles.confirmationBold}>{draft.name || "—"}</Text>
						</>
					}
				/>
			);
		}
		case "origin": {
			const Icon = draft.origin ? originIcons[draft.origin.id] : undefined;
			return (
				<ConfirmationRow
					icon={
						Icon ? (
							<Icon size={16} color={COLORS.accent} strokeWidth={1.5} />
						) : (
							<PersonIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
						)
					}
					text={
						<>
							Обрано:{" "}
							<Text style={styles.confirmationBold}>
								{draft.origin?.origin ?? "—"}
							</Text>
						</>
					}
				/>
			);
		}
		case "background":
			return (
				<ConfirmationRow
					icon={
						<QuestBookIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
					}
					text={
						<>
							Обрано:{" "}
							<Text style={styles.confirmationBold}>
								{draft.background?.title ?? "—"}
							</Text>
						</>
					}
				/>
			);
		case "class": {
			const Icon = draft.characterClass
				? classIcons[draft.characterClass.id]
				: undefined;
			return (
				<ConfirmationRow
					icon={
						Icon ? (
							<Icon size={16} color={COLORS.accent} strokeWidth={1.5} />
						) : (
							<PersonIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
						)
					}
					text={
						<>
							Обрано:{" "}
							<Text style={styles.confirmationBold}>
								{draft.characterClass?.background ?? "—"}
							</Text>
						</>
					}
				/>
			);
		}
		case "stats":
			return (
				<ConfirmationRow
					icon={
						<PersonIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
					}
					text={
						<Text style={styles.confirmationBold}>
							{draft.stats
								? "Характеристики розподілено"
								: "Характеристики ще не розподілено"}
						</Text>
					}
				/>
			);
		case "skills":
			return (
				<ConfirmationRow
					icon={
						<PersonIcon size={16} color={COLORS.accent} strokeWidth={1.5} />
					}
					text={
						<Text style={styles.confirmationBold}>
							{draft.skills
								? "Навички розподілено"
								: "Навички ще не розподілено"}
						</Text>
					}
				/>
			);
		case "summary":
			return null;
	}
}

function ConfirmationRow({ icon, text }: { icon: ReactNode; text: ReactNode }) {
	return (
		<View style={styles.confirmationRow}>
			<View style={styles.confirmationIcon}>{icon}</View>
			<Text style={styles.confirmationText}>{text}</Text>
		</View>
	);
}

export function CreateCharacterModal({
	visible,
	onClose,
	onSubmit,
}: CreateCharacterModalProps) {
	const {
		draft,
		currentStep,
		isFirst,
		isLast,
		goNext,
		goBack,
		reset,
		currentIndex,
		updateDraft,
	} = useCharacterDraft();

	const meta = STEP_META[currentStep];
	const canProceed = isStepValid(currentStep, draft);

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = () => {
		onSubmit(draft);
		handleClose();
	};

	const handleBack = () => {
		if (isFirst) {
			handleClose();
		} else {
			goBack();
		}
	};

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
			<View style={styles.container}>
				<View style={styles.topBar}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={handleBack}
						accessibilityLabel="Назад"
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<ChevronLeftIcon
							size={20}
							color={COLORS.textMuted}
							strokeWidth={1.8}
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.header}>
					<View style={styles.progress}>
						{STEPS.map((step, index) => (
							<View
								key={step}
								style={[
									styles.progressSegment,
									index <= currentIndex && styles.progressSegmentActive,
								]}
							/>
						))}
					</View>

					<Text style={styles.stepLabel}>
						Крок {currentIndex + 1} з {STEPS.length} · {meta.section}
					</Text>
					<Text style={styles.title}>{meta.title}</Text>
					<Text style={styles.description}>{meta.description}</Text>
				</View>

				<View style={styles.content}>
					<StepContent
						step={currentStep}
						draft={draft}
						onUpdate={updateDraft}
					/>
				</View>

				<View style={styles.footer}>
					<FooterConfirmation step={currentStep} draft={draft} />
					<TouchableOpacity
						style={[
							styles.buttonNext,
							!canProceed && styles.buttonNextDisabled,
						]}
						onPress={isLast ? handleSubmit : goNext}
						activeOpacity={0.85}
						disabled={!canProceed}
					>
						<Text
							style={[
								styles.buttonNextText,
								!canProceed && styles.buttonNextTextDisabled,
							]}
						>
							{meta.nextLabel}
						</Text>
						<ChevronRightIcon
							size={16}
							color={canProceed ? COLORS.onAccent : COLORS.textFaint}
							strokeWidth={2.2}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},

	topBar: {
		paddingTop: 56,
		paddingHorizontal: 24,
	},
	backButton: {
		width: 32,
		height: 32,
		alignItems: "flex-start",
		justifyContent: "center",
	},

	header: {
		paddingHorizontal: 24,
		paddingTop: 14,
		gap: 16,
	},
	progress: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	progressSegment: {
		flexGrow: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: COLORS.borderSoft,
	},
	progressSegmentActive: {
		backgroundColor: COLORS.accent,
	},
	stepLabel: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
		marginBottom: -10,
	},
	title: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 26,
		color: COLORS.text,
		letterSpacing: 0.2,
	},
	description: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		lineHeight: 19,
		marginTop: -8,
	},

	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 20,
	},

	footer: {
		paddingHorizontal: 24,
		paddingTop: 14,
		paddingBottom: 30,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
		backgroundColor: COLORS.bg,
		gap: 12,
	},

	confirmationRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	confirmationIcon: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: COLORS.accentSoft18,
		borderWidth: 1,
		borderColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	confirmationText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		flex: 1,
	},
	confirmationBold: {
		fontFamily: FONTS.bodySemiBold,
		color: COLORS.text,
	},

	buttonNext: {
		height: 52,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.accent,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	buttonNextText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.onAccent,
		letterSpacing: 0.4,
	},
	buttonNextDisabled: {
		backgroundColor: COLORS.bgElev2,
	},
	buttonNextTextDisabled: {
		color: COLORS.textFaint,
	},
});
