import type React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "@/shared/theme";
import type { CharacterDraft } from "../../types";

interface Props {
	draft: CharacterDraft;
}

export const StepSummary = ({ draft }: Props) => {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.content}
		>
			<Text style={styles.characterName}>{draft.name || "—"}</Text>
			<View style={styles.divider} />

			<Section title="Походження">
				<Row label="Раса" value={draft.origin?.origin} />
				<Row label="Розмір" value={draft.origin?.size} />
				<AbilityRow label="Здібності" values={draft.origin?.ability} />
				<Text style={styles.description}>{draft.origin?.description}</Text>
			</Section>

			<Section title="Передісторія">
				<Row label="Назва" value={draft.background?.title} />
				<Text style={styles.description}>{draft.background?.description}</Text>
			</Section>

			<Section title="Клас">
				<Row label="Клас" value={draft.characterClass?.background} />
				<Row
					label="Кістка здоров'я"
					value={
						draft.characterClass ? `d${draft.characterClass.hitDie}` : undefined
					}
				/>
				<Row
					label="Початкове HP"
					value={draft.characterClass?.startingHP?.toString()}
				/>
				<Row
					label="Ключові характеристики"
					value={draft.characterClass?.keyStats.join(", ")}
				/>
				<Row label="Порятунки" value={draft.characterClass?.saves.join(", ")} />
				<Row label="Броня" value={draft.characterClass?.armor} />
				<Row label="Зброя" value={draft.characterClass?.weapons.join(", ")} />
			</Section>

			<Section title="Початкове спорядження">
				{draft.characterClass?.startingGear.map((item) => (
					<Text key={item} style={styles.gearItem}>
						· {item}
					</Text>
				))}
			</Section>
		</ScrollView>
	);
};

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{children}
		</View>
	);
}

function Row({ label, value }: { label: string; value?: string }) {
	if (!value) return null;
	return (
		<View style={styles.row}>
			<Text style={styles.rowLabel}>{label}</Text>
			<Text style={styles.rowValue}>{value}</Text>
		</View>
	);
}

function AbilityRow({ label, values }: { label: string; values?: string[] }) {
	if (!values?.length) return null;
	return (
		<View style={styles.abilityBlock}>
			<Text style={styles.rowLabel}>{label}</Text>
			{values.map((item, index) => (
				<Text
					key={item}
					style={index === 0 ? styles.abilityFirst : styles.abilityItem}
				>
					{index === 0 ? item : `· ${item}`}
				</Text>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingBottom: 16,
	},
	characterName: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 26,
		color: COLORS.text,
		marginBottom: 16,
	},
	divider: {
		height: 1,
		backgroundColor: COLORS.accent,
		opacity: 0.7,
		marginBottom: 24,
	},

	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 10,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: 16,
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
	},
	rowLabel: {
		flexShrink: 1,
		fontFamily: FONTS.bodyRegular,
		fontSize: 14,
		color: COLORS.textMuted,
	},
	rowValue: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 14,
		color: COLORS.text,
		flexShrink: 1,
		textAlign: "right",
	},

	description: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 14,
		color: COLORS.textMuted,
		marginTop: 8,
		lineHeight: 20,
	},
	gearItem: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 14,
		color: COLORS.text,
		paddingVertical: 4,
	},
	abilityBlock: {
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
		gap: 2,
	},
	abilityFirst: {
		fontFamily: FONTS.bodyMedium,
		fontSize: 14,
		color: COLORS.text,
		marginTop: 4,
	},
	abilityItem: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		lineHeight: 19,
	},
});
