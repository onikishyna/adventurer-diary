import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import type { ClassFeature } from "./types";

interface ClassFeaturesProps {
	features: ClassFeature[];
	// only features gained at or below this level are shown
	level: number;
}

// class rules as a stack of cards, styled like the race ability card on the
// sheet; shared by the sheet's reference tab and the class creation step
export function ClassFeatures({ features, level }: ClassFeaturesProps) {
	const unlocked = features.filter(
		(feature) => (feature.minLevel ?? 1) <= level,
	);

	return (
		<View style={styles.list}>
			{unlocked.map((feature) => (
				<View key={feature.title} style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>{feature.title}</Text>
						{(feature.minLevel ?? 1) > 1 && (
							<Text style={styles.levelBadge}>Рів. {feature.minLevel}</Text>
						)}
					</View>
					{feature.lines.map((line) => {
						const isListItem = line.startsWith("–");
						return (
							<Text
								key={line}
								style={[styles.text, isListItem && styles.listItem]}
							>
								{line}
							</Text>
						);
					})}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		gap: 10,
	},
	card: {
		padding: 14,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		gap: 6,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: 10,
	},
	title: {
		flex: 1,
		fontFamily: FONTS.headingSemiBold,
		fontSize: 15,
		color: COLORS.accent,
	},
	levelBadge: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		marginTop: 2,
	},
	text: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		lineHeight: 19,
	},
	listItem: {
		paddingLeft: 8,
	},
});
