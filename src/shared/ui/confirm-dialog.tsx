import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, RADII } from "@/shared/theme";

interface ConfirmDialogProps {
	visible: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel?: string;
	destructive?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmDialog({
	visible,
	title,
	message,
	confirmLabel,
	cancelLabel = "Скасувати",
	destructive = false,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={onCancel}
							activeOpacity={0.8}
						>
							<Text style={styles.cancelText}>{cancelLabel}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.confirmButton,
								destructive && styles.confirmButtonDanger,
							]}
							onPress={onConfirm}
							activeOpacity={0.85}
						>
							<Text style={styles.confirmText}>{confirmLabel}</Text>
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
		gap: 10,
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
	actions: {
		flexDirection: "row",
		gap: 10,
		marginTop: 10,
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
	confirmButtonDanger: {
		backgroundColor: COLORS.crimson,
	},
	confirmText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
		letterSpacing: 0.3,
	},
});
