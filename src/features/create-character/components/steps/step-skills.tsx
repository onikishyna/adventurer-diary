import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { Background } from "@/entities/background";
import type { Stat } from "@/entities/character-classes";
import type { Skill } from "@/entities/skill";
import { DEFAULT_SKILLS, FREE_SKILL_POINTS, SKILLS } from "@/entities/skill";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { MinusIcon, PlusIcon } from "@/shared/ui/icons";

interface Props {
	stats: Record<Stat, number>;
	value: Record<Skill, number> | null;
	onChange: (skills: Record<Skill, number> | null) => void;
	// a background can grant a flat bonus to one skill (e.g. Дикий +1
	// Naturecraft) — shown here as a preview but never baked into the
	// committed `value`, so it stays a single source of truth on `background`
	background?: Background | null;
}

const formatValue = (val: number) => (val >= 0 ? `+${val}` : `${val}`);

export const StepSkills = ({ stats, value, onChange, background }: Props) => {
	// each skill starts at its governing stat's score; bonuses are the 4 free
	// points layered on top — rehydrate from a previously committed value so
	// navigating back doesn't lose the allocation
	const [bonuses, setBonuses] = useState<Record<Skill, number>>(() => {
		const initial = { ...DEFAULT_SKILLS };
		if (value) {
			for (const skill of SKILLS) {
				initial[skill.id] = value[skill.id] - stats[skill.stat];
			}
		}
		return initial;
	});

	const spent = Object.values(bonuses).reduce((sum, n) => sum + n, 0);
	const remaining = FREE_SKILL_POINTS - spent;

	const commit = (next: Record<Skill, number>) => {
		setBonuses(next);
		const spentNext = Object.values(next).reduce((sum, n) => sum + n, 0);
		if (spentNext === FREE_SKILL_POINTS) {
			const result = {} as Record<Skill, number>;
			for (const skill of SKILLS) {
				result[skill.id] = stats[skill.stat] + next[skill.id];
			}
			onChange(result);
		} else {
			onChange(null);
		}
	};

	const increment = (id: Skill) => {
		if (remaining <= 0) return;
		commit({ ...bonuses, [id]: bonuses[id] + 1 });
	};

	const decrement = (id: Skill) => {
		if (bonuses[id] <= 0) return;
		commit({ ...bonuses, [id]: bonuses[id] - 1 });
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.headerRow}>
				<Text style={styles.label}>Навички</Text>
				<Text
					style={[
						styles.pointsBadge,
						remaining === 0 && styles.pointsBadgeDone,
					]}
				>
					Вільні очки: {remaining} / {FREE_SKILL_POINTS}
				</Text>
			</View>

			<View style={styles.list}>
				{SKILLS.map(({ id, label, stat }) => {
					const backgroundBonus =
						background?.bonuses?.skill === id
							? (background.bonuses.skillBonus ?? 0)
							: 0;
					const total = stats[stat] + bonuses[id] + backgroundBonus;
					return (
						<View key={id} style={styles.row}>
							<View style={styles.rowInfo}>
								<Text style={styles.skillName}>{label}</Text>
								<Text style={styles.skillStat}>{stat}</Text>
								{backgroundBonus !== 0 && (
									<Text style={styles.skillBackgroundBonus}>
										{background?.title}
									</Text>
								)}
							</View>
							<TouchableOpacity
								style={[
									styles.stepButton,
									bonuses[id] <= 0 && styles.stepButtonDisabled,
								]}
								onPress={() => decrement(id)}
								disabled={bonuses[id] <= 0}
								hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
								accessibilityLabel={`Зменшити ${label}`}
							>
								<MinusIcon
									size={10}
									color={COLORS.textMuted}
									strokeWidth={2.4}
								/>
							</TouchableOpacity>
							<Text style={styles.skillValue}>{formatValue(total)}</Text>
							<TouchableOpacity
								style={[
									styles.stepButton,
									remaining <= 0 && styles.stepButtonDisabled,
								]}
								onPress={() => increment(id)}
								disabled={remaining <= 0}
								hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
								accessibilityLabel={`Збільшити ${label}`}
							>
								<PlusIcon
									size={10}
									color={COLORS.textMuted}
									strokeWidth={2.4}
								/>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	label: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		letterSpacing: 1.2,
		textTransform: "uppercase",
	},
	pointsBadge: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12,
		color: COLORS.textMuted,
	},
	pointsBadgeDone: {
		color: COLORS.accent,
	},

	list: {
		gap: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: COLORS.bgElev,
	},
	rowInfo: {
		flex: 1,
		flexDirection: "row",
		alignItems: "baseline",
		gap: 8,
		minWidth: 0,
	},
	skillName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.text,
	},
	skillStat: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10.5,
		letterSpacing: 0.5,
		color: COLORS.textFaint,
	},
	skillBackgroundBonus: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 10,
		fontStyle: "italic",
		color: COLORS.accent,
	},
	stepButton: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	stepButtonDisabled: {
		opacity: 0.4,
	},
	skillValue: {
		width: 34,
		textAlign: "center",
		fontFamily: FONTS.bodyBold,
		fontSize: 15,
		color: COLORS.text,
	},
});
