import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { SpellSchool } from "@/entities/spell";
import { SPELL_SCHOOLS, SPELLS, schoolIcons } from "@/entities/spell";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { ChevronLeftIcon } from "@/shared/ui/icons";
import { SpellRow } from "./spell-row";

interface SpellsBrowserProps {
	// when provided, every spell row becomes tappable and shows a plus/check
	// indicator — used by the character sheet's "add a spell" picker
	selectedIds?: string[];
	onToggleSpell?: (spellId: string) => void;
}

export function SpellsBrowser({
	selectedIds,
	onToggleSpell,
}: SpellsBrowserProps = {}) {
	const [expanded, setExpanded] = useState<SpellSchool | null>(null);
	const selectable = !!onToggleSpell;

	return (
		<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
			<Text style={styles.sectionLabel}>Школи заклинань</Text>

			{SPELL_SCHOOLS.map((school) => {
				const Icon = schoolIcons[school.id];
				const isOpen = expanded === school.id;
				const spells = SPELLS.filter((spell) => spell.school === school.id);

				return (
					<View key={school.id} style={styles.card}>
						<TouchableOpacity
							style={styles.header}
							onPress={() => setExpanded(isOpen ? null : school.id)}
							activeOpacity={0.7}
						>
							<View style={[styles.iconBadge, { borderColor: school.color }]}>
								<Icon size={18} color={school.color} strokeWidth={1.6} />
							</View>
							<Text style={styles.label}>{school.label}</Text>
							<ChevronLeftIcon
								size={13}
								color={COLORS.textFaint}
								strokeWidth={2}
								style={isOpen ? styles.chevronOpen : styles.chevronClosed}
							/>
						</TouchableOpacity>

						{isOpen && (
							<View style={styles.content}>
								{spells.length === 0 ? (
									<Text style={styles.empty}>
										Поки немає заклинань цієї школи
									</Text>
								) : (
									spells.map((spell) => (
										<SpellRow
											key={spell.id}
											spell={spell}
											selectable={selectable}
											selected={selectedIds?.includes(spell.id)}
											onPress={() => onToggleSpell?.(spell.id)}
										/>
									))
								)}
							</View>
						)}
					</View>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
		paddingHorizontal: 24,
	},
	sectionLabel: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
		paddingTop: 18,
		paddingBottom: 12,
	},

	card: {
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.bgElev,
		marginBottom: 10,
		overflow: "hidden",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		padding: 12,
	},
	iconBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 1,
		backgroundColor: COLORS.bgElev2,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	label: {
		flex: 1,
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	chevronClosed: { transform: [{ rotate: "-90deg" }] },
	chevronOpen: { transform: [{ rotate: "90deg" }] },

	content: {
		paddingHorizontal: 14,
		paddingBottom: 14,
		borderTopWidth: 1,
		borderTopColor: COLORS.borderSoft,
		paddingTop: 10,
	},
	empty: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.textFaint,
		fontStyle: "italic",
	},
});
