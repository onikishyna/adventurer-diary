import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "@/shared/theme";

interface ChargeTrackerProps {
	title: string;
	max: number;
	used: number;
	onChangeUsed: (next: number) => void;
}

// a row of pips: tapping an empty pip spends a charge, tapping a filled one
// gives it back. Spent pips always fill from the left, so the row reads as a
// count rather than a set of independent toggles
export function ChargeTracker({
	title,
	max,
	used,
	onChangeUsed,
}: ChargeTrackerProps) {
	const available = max - used;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity
					onPress={() => onChangeUsed(0)}
					disabled={used === 0}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					accessibilityLabel={`Скинути: ${title}`}
				>
					<Text style={[styles.reset, used === 0 && styles.resetDisabled]}>
						Скинути
					</Text>
				</TouchableOpacity>
			</View>

			{max > 0 ? (
				<View style={styles.row}>
					<View style={styles.pips}>
						{Array.from({ length: max }, (_, index) => {
							const isUsed = index < used;
							return (
								<TouchableOpacity
									// biome-ignore lint/suspicious/noArrayIndexKey: pips are positional
									key={index}
									style={[styles.pip, isUsed && styles.pipUsed]}
									onPress={() => onChangeUsed(isUsed ? used - 1 : used + 1)}
									activeOpacity={0.7}
									hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
									role="checkbox"
									aria-checked={isUsed}
									accessibilityLabel={`Заряд ${index + 1}`}
								/>
							);
						})}
					</View>
					<Text style={styles.counter}>Залишилось {available}</Text>
				</View>
			) : (
				<Text style={styles.empty}>Немає зарядів</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},
	reset: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12.5,
		color: COLORS.accent,
	},
	resetDisabled: {
		opacity: 0.35,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	pips: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	pip: {
		width: 26,
		height: 26,
		borderRadius: 13,
		borderWidth: 1.5,
		borderColor: COLORS.accentSoft35,
		backgroundColor: "transparent",
	},
	pipUsed: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accent,
	},
	counter: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 13,
		color: COLORS.textMuted,
	},
	empty: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textFaint,
	},
});
