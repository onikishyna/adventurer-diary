import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Spell } from "@/entities/spell";
import { SPELL_SCHOOLS, schoolIcons } from "@/entities/spell";
import { COLORS, FONTS } from "@/shared/theme";
import { CheckIcon, PlusIcon } from "@/shared/ui/icons";

const SCHOOL_BY_ID = Object.fromEntries(
	SPELL_SCHOOLS.map((school) => [school.id, school]),
) as Record<string, (typeof SPELL_SCHOOLS)[number]>;

interface SpellRowProps {
	spell: Spell;
	// when provided, the row becomes tappable and shows a plus/check
	// indicator on the right (check = already known); used by the picker
	// modal to add spells and by the character sheet to remove them
	selectable?: boolean;
	selected?: boolean;
	onPress?: () => void;
}

export function SpellRow({
	spell,
	selectable,
	selected,
	onPress,
}: SpellRowProps) {
	const flavor = spell.flavor ? SCHOOL_BY_ID[spell.flavor] : null;
	const FlavorIcon = spell.flavor ? schoolIcons[spell.flavor] : null;

	const details = (
		<View style={styles.details}>
			<View style={styles.header}>
				<Text style={styles.name}>{spell.name}</Text>
				<Text style={styles.tier}>{spell.tier}</Text>
			</View>
			{flavor && FlavorIcon && (
				<View style={styles.flavor}>
					<FlavorIcon size={11} color={flavor.color} strokeWidth={1.8} />
					<Text style={[styles.flavorLabel, { color: flavor.color }]}>
						{flavor.label}
					</Text>
				</View>
			)}
			<Text style={styles.meta}>
				{spell.actions} · {spell.target}
			</Text>
			<Text style={styles.description}>{spell.description}</Text>
			{spell.upcast && <Text style={styles.upcast}>{spell.upcast}</Text>}
		</View>
	);

	if (!selectable) {
		return <View style={styles.row}>{details}</View>;
	}

	return (
		<TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
			<View style={styles.selectableRow}>
				{details}
				<View
					style={[
						styles.selectIndicator,
						selected && styles.selectIndicatorActive,
					]}
				>
					{selected ? (
						<CheckIcon size={13} color={COLORS.onAccent} strokeWidth={2.4} />
					) : (
						<PlusIcon size={13} color={COLORS.textFaint} strokeWidth={2.2} />
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	row: {
		paddingVertical: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
	},
	selectableRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
	},
	details: {
		flex: 1,
		gap: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
		gap: 8,
	},
	name: {
		flex: 1,
		fontFamily: FONTS.headingSemiBold,
		fontSize: 13.5,
		color: COLORS.text,
	},
	tier: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10.5,
		color: COLORS.accent,
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	flavor: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	flavorLabel: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 10,
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	meta: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 11,
		color: COLORS.textFaint,
	},
	description: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.textMuted,
		lineHeight: 18,
	},
	upcast: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12,
		color: COLORS.textFaint,
		fontStyle: "italic",
	},
	selectIndicator: {
		width: 26,
		height: 26,
		borderRadius: 13,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		backgroundColor: COLORS.bgElev2,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		marginTop: 2,
	},
	selectIndicatorActive: {
		backgroundColor: COLORS.accent,
		borderColor: COLORS.accent,
	},
});
