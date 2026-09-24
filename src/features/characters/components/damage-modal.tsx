import { useState } from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { COLORS, FONTS, RADII } from "@/shared/theme";

interface DamageModalProps {
	visible: boolean;
	defense: number;
	onClose: () => void;
	onApply: (finalDamage: number) => void;
}

type Phase = "amount" | "defend";

// two-step flow: enter a raw damage amount, then decide whether to defend
// (subtracting Захист from the amount before it's applied to HP)
export function DamageModal({
	visible,
	defense,
	onClose,
	onApply,
}: DamageModalProps) {
	const [phase, setPhase] = useState<Phase>("amount");
	const [text, setText] = useState("");

	const reset = () => {
		setPhase("amount");
		setText("");
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const amount = Number.parseInt(text.trim(), 10);
	const isValidAmount =
		text.trim() !== "" && !Number.isNaN(amount) && amount > 0;

	const handleNext = () => {
		if (!isValidAmount) return;
		setPhase("defend");
	};

	const handleDefend = (defend: boolean) => {
		const finalDamage = defend ? Math.max(0, amount - defense) : amount;
		onApply(finalDamage);
		reset();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					{phase === "amount" ? (
						<>
							<Text style={styles.title}>Нанести урон</Text>
							<TextInput
								style={styles.input}
								placeholder="Кількість урону"
								placeholderTextColor={COLORS.textFaint}
								value={text}
								onChangeText={setText}
								keyboardType="number-pad"
								autoFocus
							/>
							<View style={styles.actions}>
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={handleClose}
									activeOpacity={0.8}
								>
									<Text style={styles.cancelText}>Скасувати</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.confirmButton,
										!isValidAmount && styles.confirmButtonDisabled,
									]}
									onPress={handleNext}
									activeOpacity={0.85}
									disabled={!isValidAmount}
								>
									<Text style={styles.confirmText}>Далі</Text>
								</TouchableOpacity>
							</View>
						</>
					) : (
						<>
							<Text style={styles.title}>Захищатись?</Text>
							<Text style={styles.message}>
								Урон: {amount}. Якщо захищатись, з нього віднімається Захист (−
								{defense}).
							</Text>
							<View style={styles.actions}>
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={() => handleDefend(false)}
									activeOpacity={0.8}
								>
									<Text style={styles.cancelText}>Ні</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.confirmButton}
									onPress={() => handleDefend(true)}
									activeOpacity={0.85}
								>
									<Text style={styles.confirmText}>Так</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
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
		borderRadius: RADII.xxl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		padding: 22,
		gap: 14,
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
		backgroundColor: COLORS.crimson,
		alignItems: "center",
		justifyContent: "center",
	},
	confirmButtonDisabled: {
		opacity: 0.4,
	},
	confirmText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
		letterSpacing: 0.3,
	},
});
