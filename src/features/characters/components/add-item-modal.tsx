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
import { QuantityStepper } from "./quantity-stepper";

interface AddItemModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (name: string, quantity: number) => void;
}

export function AddItemModal({
	visible,
	onClose,
	onSubmit,
}: AddItemModalProps) {
	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState(1);

	const reset = () => {
		setName("");
		setQuantity(1);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		onSubmit(trimmed, quantity);
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
					<Text style={styles.title}>Додати предмет</Text>

					<TextInput
						style={styles.input}
						placeholder="Назва предмета"
						placeholderTextColor={COLORS.textFaint}
						value={name}
						onChangeText={setName}
						autoFocus
					/>

					<View style={styles.quantityRow}>
						<Text style={styles.quantityLabel}>Кількість</Text>
						<QuantityStepper
							value={quantity}
							onIncrement={() => setQuantity((prev) => prev + 1)}
							onDecrement={() => setQuantity((prev) => Math.max(1, prev - 1))}
							onChangeValue={setQuantity}
						/>
					</View>

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
								!name.trim() && styles.confirmButtonDisabled,
							]}
							onPress={handleSubmit}
							activeOpacity={0.85}
							disabled={!name.trim()}
						>
							<Text style={styles.confirmText}>Додати</Text>
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
	quantityRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	quantityLabel: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13.5,
		color: COLORS.textMuted,
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
		backgroundColor: COLORS.accentSoft35,
	},
	confirmText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.onAccent,
		letterSpacing: 0.3,
	},
});
