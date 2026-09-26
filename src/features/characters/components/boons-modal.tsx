import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { BOON_TIERS } from "@/entities/boon";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { CheckIcon, PlusIcon } from "@/shared/ui/icons";

interface BoonsModalProps {
	visible: boolean;
	selectedIds: string[];
	onToggle: (boonId: string) => void;
	onClose: () => void;
}

export function BoonsModal({
	visible,
	selectedIds,
	onToggle,
	onClose,
}: BoonsModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>Boons</Text>
						<Text style={styles.message}>
							Додай бун, який видав гейм-майстер. Повторний дотик прибирає його.
						</Text>
					</View>

					<ScrollView
						style={styles.list}
						contentContainerStyle={styles.listContent}
						showsVerticalScrollIndicator={false}
					>
						{BOON_TIERS.map((tier) => (
							<View key={tier.id} style={styles.tier}>
								<Text style={styles.tierLabel}>{tier.label}</Text>
								{tier.boons.map((boon) => {
									const isSelected = selectedIds.includes(boon.id);
									return (
										<TouchableOpacity
											key={boon.id}
											style={[
												styles.option,
												isSelected && styles.optionSelected,
											]}
											onPress={() => onToggle(boon.id)}
											activeOpacity={0.8}
											role="checkbox"
											aria-checked={isSelected}
											accessibilityLabel={boon.title}
										>
											<View style={styles.optionText}>
												<Text
													style={[
														styles.optionTitle,
														isSelected && styles.optionTitleSelected,
													]}
												>
													{boon.title}
												</Text>
												{boon.lines.map((line) => (
													<Text key={line} style={styles.optionLine}>
														{line}
													</Text>
												))}
											</View>
											<View
												style={[
													styles.indicator,
													isSelected && styles.indicatorSelected,
												]}
											>
												{isSelected ? (
													<CheckIcon
														size={13}
														color={COLORS.onAccent}
														strokeWidth={2.4}
													/>
												) : (
													<PlusIcon
														size={13}
														color={COLORS.textFaint}
														strokeWidth={2.2}
													/>
												)}
											</View>
										</TouchableOpacity>
									);
								})}
							</View>
						))}
					</ScrollView>

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
		maxHeight: "90%",
		borderRadius: RADII.xxl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		padding: 22,
		gap: 14,
	},
	header: {
		gap: 6,
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
	list: {
		flexShrink: 1,
	},
	listContent: {
		gap: 16,
	},
	tier: {
		gap: 6,
	},
	tierLabel: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 11,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
		marginBottom: 2,
	},
	option: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: COLORS.bgElev2,
	},
	optionSelected: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accentSoft10,
	},
	optionText: {
		flex: 1,
		gap: 4,
	},
	optionTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12.5,
		color: COLORS.text,
	},
	optionTitleSelected: {
		color: COLORS.accent,
	},
	optionLine: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.textMuted,
		lineHeight: 18,
	},
	indicator: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		backgroundColor: COLORS.bgElev,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	indicatorSelected: {
		backgroundColor: COLORS.accent,
		borderColor: COLORS.accent,
	},
	doneButton: {
		height: 46,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 4,
	},
	doneText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.onAccent,
		letterSpacing: 0.3,
	},
});
