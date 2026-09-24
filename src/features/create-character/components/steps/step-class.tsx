import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	type CharacterClass,
	classIcons,
	heroes,
} from "@/entities/character-classes";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { CheckIcon } from "@/shared/ui/icons";

interface StepClassProps {
	value: CharacterClass | null;
	onChange: (characterClass: CharacterClass) => void;
}

export const StepClass = ({ value, onChange }: StepClassProps) => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Text style={styles.label}>Клас</Text>

			<View style={styles.list}>
				{heroes.map((hero) => {
					const Icon = classIcons[hero.id];
					const selected = value?.id === hero.id;
					return (
						<TouchableOpacity
							key={hero.id}
							style={[styles.card, selected && styles.cardSelected]}
							onPress={() => onChange(hero)}
							activeOpacity={0.7}
						>
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
									{hero.background}
								</Text>
								<Text style={styles.cardSubtitle} numberOfLines={2}>
									{hero.keyStats.join(" / ")}
								</Text>
							</View>
							{selected && (
								<View style={styles.badge}>
									<CheckIcon size={11} color={COLORS.onAccent} />
								</View>
							)}
						</TouchableOpacity>
					);
				})}
			</View>

			{value && (
				<View style={styles.infoCard}>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Кістка здоров'я</Text>
						<Text style={styles.infoValue}>d{value.hitDie}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Початкове HP</Text>
						<Text style={styles.infoValue}>{value.startingHP}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Ключові характеристики</Text>
						<Text style={styles.infoValue}>{value.keyStats.join(", ")}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Сейви</Text>
						<Text style={styles.infoValue}>{value.saves.join(", ")}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Броня</Text>
						<Text style={styles.infoValue}>{value.armor}</Text>
					</View>

					<View style={styles.listBlock}>
						<Text style={styles.infoLabel}>Зброя</Text>
						{value.weapons.map((item, index) => (
							<Text key={item} style={styles.listItem}>
								{index === 0 ? item : `· ${item}`}
							</Text>
						))}
					</View>

					<View style={styles.listBlock}>
						<Text style={styles.infoLabel}>Початкове спорядження</Text>
						{value.startingGear.map((item, index) => (
							<Text key={item} style={styles.listItem}>
								{index === 0 ? item : `· ${item}`}
							</Text>
						))}
					</View>
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

	list: {
		gap: 10,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.xl,
		padding: 12,
		backgroundColor: COLORS.bgElev,
	},
	cardSelected: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accentSoft10,
	},
	icon: {
		width: 42,
		height: 42,
		borderRadius: 10,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	iconSelected: {
		backgroundColor: COLORS.accentSoft18,
		borderColor: COLORS.accent,
	},
	cardText: {
		flex: 1,
		gap: 2,
	},
	cardName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	cardNameSelected: {
		color: COLORS.accent,
	},
	cardSubtitle: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 11,
		color: COLORS.textMuted,
		lineHeight: 15,
	},
	badge: {
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
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
		alignItems: "center",
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
		textAlign: "right",
		flexShrink: 1,
		marginLeft: 16,
	},

	listBlock: {
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
		gap: 2,
	},
	listItem: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
	},
});
