import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { STEPS, useCharacterDraft } from "../hooks/use-character-draft";
import type { CharacterDraft, CreationStep } from "../types";
import {
	StepBackground,
	StepClass,
	StepInput,
	StepOrigin,
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

const COLORS = {
	background: "#F2EBDE",
	dark: "#12131A",
	surface: "#23202E",
	text: "#2E2720",
	textSecondary: "#7A6E61",
	accent: "#5B21B6",
};

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
		case "summary":
			return <StepSummary draft={draft} />;
	}
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

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = () => {
		onSubmit(draft);
		handleClose();
	};

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={handleClose}
						accessibilityLabel="Закрити"
					>
						<Text style={styles.closeIcon}>✕</Text>
					</TouchableOpacity>
					<Text style={styles.title}>Новий персонаж</Text>
					<View style={styles.divider} />
					<Text style={styles.subtitle}>
						Крок {currentIndex + 1} з {STEPS.length}
					</Text>
				</View>

				<View style={styles.steps}>
					{STEPS.map((step) => (
						<View
							key={step}
							style={[
								styles.stepDot,
								currentStep === step && styles.stepDotActive,
							]}
						/>
					))}
				</View>

				<View style={styles.content}>
					<StepContent
						step={currentStep}
						draft={draft}
						onUpdate={updateDraft}
					/>
				</View>

				<View style={styles.footer}>
					{!isFirst ? (
						<TouchableOpacity style={styles.buttonBack} onPress={goBack}>
							<Text style={styles.buttonBackText}>← Назад</Text>
						</TouchableOpacity>
					) : (
						<View />
					)}
					<TouchableOpacity
						style={styles.buttonNext}
						onPress={isLast ? handleSubmit : goNext}
					>
						<Text style={styles.buttonNextText}>
							{isLast ? "Створити" : "Далі →"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},

	header: {
		paddingTop: 56,
		paddingHorizontal: 28,
		paddingBottom: 24,
	},
	title: {
		fontFamily: "Cinzel-SemiBold",
		fontSize: 24,
		color: COLORS.dark,
		letterSpacing: 0.5,
		marginBottom: 16,
	},
	divider: {
		height: 1.5,
		backgroundColor: COLORS.accent,
		opacity: 0.7,
		marginBottom: 14,
	},
	subtitle: {
		fontFamily: "EBGaramond-Italic",
		fontSize: 16,
		fontStyle: "italic",
		color: COLORS.textSecondary,
	},

	content: {
		flex: 1,
		paddingHorizontal: 28,
		paddingTop: 8,
	},

	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 28,
		paddingBottom: 36,
		paddingTop: 16,
	},

	buttonBack: {
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	buttonBackText: {
		fontFamily: "EBGaramond-Italic",
		fontSize: 16,
		fontStyle: "italic",
		color: COLORS.textSecondary,
	},

	buttonNext: {
		backgroundColor: "#4D355F",
		paddingVertical: 14,
		paddingHorizontal: 32,
		borderRadius: 999,
		shadowColor: "#4D355F",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonNextText: {
		fontFamily: "Cinzel-SemiBold",
		fontSize: 15,
		color: COLORS.background,
		letterSpacing: 0.5,
	},

	steps: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 6,
		paddingBottom: 16,
	},
	stepDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: COLORS.textSecondary,
		opacity: 0.3,
	},
	stepDotActive: {
		backgroundColor: COLORS.accent,
		opacity: 1,
		width: 18,
	},

	closeButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#4D355F",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-end",
		marginBottom: 16,
	},
	closeIcon: {
		color: "#F2EBDE",
		fontSize: 16,
	},
});
