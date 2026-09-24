import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type Origin, originIcons, origins } from "@/entities/ancestry";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { CheckIcon } from "@/shared/ui/icons";

interface StepOriginProps {
	value: Origin | null;
	onChange: (origin: Origin) => void;
}

export const StepOrigin = ({ value, onChange }: StepOriginProps) => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Text style={styles.label}>Раса</Text>

			<View style={styles.grid}>
				{origins.map((origin) => {
					const Icon = originIcons[origin.id];
					const selected = value?.id === origin.id;
					return (
						<TouchableOpacity
							key={origin.id}
							style={[styles.card, selected && styles.cardSelected]}
							onPress={() => onChange(origin)}
							activeOpacity={0.7}
						>
							{selected && (
								<View style={styles.badge}>
									<CheckIcon size={11} color={COLORS.onAccent} />
								</View>
							)}
							<View style={[styles.icon, selected && styles.iconSelected]}>
								{Icon && (
									<Icon
										size={21}
										color={selected ? COLORS.accent : COLORS.textMuted}
									/>
								)}
							</View>
							<View style={styles.cardText}>
								<Text
									style={[styles.cardName, selected && styles.cardNameSelected]}
								>
									{origin.origin}
								</Text>
								<Text style={styles.cardAbility} numberOfLines={2}>
									{origin.ability[0]}
								</Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>

			{value && (
				<View style={styles.infoCard}>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Розмір</Text>
						<Text style={styles.infoValue}>{value.size}</Text>
					</View>
					<View style={styles.abilityBlock}>
						<Text style={styles.infoLabel}>Здібності</Text>
						{value.ability.map((item, index) => (
							<Text
								key={item}
								style={index === 0 ? styles.abilityFirst : styles.abilityItem}
							>
								{index === 0 ? item : `· ${item}`}
							</Text>
						))}
					</View>
					<Text style={styles.infoDescription}>{value.description}</Text>
				</View>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	label: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 12,
	},

	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	card: {
		width: "47%",
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.xl,
		padding: 12,
		gap: 10,
		backgroundColor: COLORS.bgElev,
		position: "relative",
	},
	cardSelected: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accentSoft10,
	},
	badge: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	iconSelected: {
		backgroundColor: COLORS.accentSoft18,
		borderColor: COLORS.accent,
	},
	cardText: {
		gap: 3,
	},
	cardName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	cardNameSelected: {
		color: COLORS.accent,
	},
	cardAbility: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 11,
		color: COLORS.textMuted,
		lineHeight: 15,
	},

	infoCard: {
		borderWidth: 1,
		borderColor: COLORS.accent,
		borderRadius: RADII.lg,
		padding: 16,
		backgroundColor: COLORS.accentSoft10,
		marginTop: 14,
		marginBottom: 8,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
	},
	infoLabel: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
	},
	infoValue: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.text,
	},
	infoDescription: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		marginTop: 12,
		lineHeight: 19,
	},
	abilityBlock: {
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
		gap: 2,
	},
	abilityFirst: {
		fontFamily: FONTS.bodyMedium,
		fontSize: 13,
		color: COLORS.text,
		marginTop: 4,
	},
	abilityItem: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12,
		color: COLORS.textMuted,
	},
});
