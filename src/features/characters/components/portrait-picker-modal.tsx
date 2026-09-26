import {
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { extraPortraits, originImages, origins } from "@/entities/ancestry";
import { COLORS, FONTS, RADII } from "@/shared/theme";

interface PortraitPickerModalProps {
	visible: boolean;
	selectedId: string;
	originId: string;
	onSelect: (portraitId: string | undefined) => void;
	onClose: () => void;
}

export function PortraitPickerModal({
	visible,
	selectedId,
	originId,
	onSelect,
	onClose,
}: PortraitPickerModalProps) {
	const portraits = [
		...Object.entries(originImages).map(([id, source]) => ({
			id,
			source,
			label: origins.find((origin) => origin.id === id)?.origin ?? id,
		})),
		...extraPortraits,
	];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<Text style={styles.title}>Портрет</Text>
					<Text style={styles.message}>
						За замовчуванням — портрет твоєї раси.
					</Text>

					<View style={styles.grid}>
						{portraits.map(({ id, source, label }) => {
							const isSelected = selectedId === id;
							const isDefault = id === originId;
							return (
								<TouchableOpacity
									key={id}
									style={styles.tile}
									onPress={() => onSelect(isDefault ? undefined : id)}
									activeOpacity={0.8}
									role="radio"
									aria-checked={isSelected}
									accessibilityLabel={label}
								>
									<Image
										source={source}
										style={[
											styles.portrait,
											isSelected && styles.portraitSelected,
										]}
									/>
									<Text
										style={[styles.label, isSelected && styles.labelSelected]}
									>
										{label}
									</Text>
									{isDefault && <Text style={styles.hint}>твоя раса</Text>}
								</TouchableOpacity>
							);
						})}
					</View>

					<TouchableOpacity
						style={styles.doneButton}
						onPress={onClose}
						activeOpacity={0.85}
					>
						<Text style={styles.doneText}>Готово</Text>
					</TouchableOpacity>
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
		gap: 12,
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		gap: 12,
		marginTop: 4,
	},
	tile: {
		alignItems: "center",
		gap: 6,
		width: 84,
	},
	portrait: {
		width: 72,
		height: 72,
		borderRadius: 36,
		borderWidth: 2,
		borderColor: COLORS.borderSoft,
	},
	portraitSelected: {
		borderColor: COLORS.accent,
		borderWidth: 3,
	},
	label: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12.5,
		color: COLORS.textMuted,
		textAlign: "center",
	},
	labelSelected: {
		color: COLORS.accent,
	},
	hint: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10.5,
		color: COLORS.textFaint,
		marginTop: -4,
	},
	doneButton: {
		height: 46,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	doneText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.onAccent,
		letterSpacing: 0.3,
	},
});
