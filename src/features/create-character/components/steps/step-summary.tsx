import type React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { CharacterDraft } from "../../types";

interface Props {
	draft: CharacterDraft;
}

export const StepSummary = ({ draft }: Props) => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
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
		<View style={styles.row}>
			<Text style={styles.rowLabel}>{label}</Text>
			<View style={styles.abilityList}>
				{values.map((item, index) => (
					<Text
						key={item}
						style={index === 0 ? styles.abilityFirst : styles.abilityItem}
					>
						{item}
					</Text>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	characterName: {
		fontSize: 26,
		color: "#12131A",
		fontStyle: "italic",
		marginBottom: 16,
	},
	divider: {
		height: 1.5,
		backgroundColor: "#5B21B6",
		opacity: 0.7,
		marginBottom: 24,
	},

	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 11,
		color: "#7A6E61",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 10,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.12)",
	},
	rowLabel: {
		fontSize: 14,
		color: "#7A6E61",
	},
	rowValue: {
		fontSize: 14,
		color: "#2E2720",
		flexShrink: 1,
		textAlign: "right",
		marginLeft: 16,
	},

	description: {
		fontSize: 14,
		color: "#7A6E61",
		fontStyle: "italic",
		marginTop: 8,
		lineHeight: 20,
	},
	gearItem: {
		fontSize: 14,
		color: "#2E2720",
		paddingVertical: 4,
	},
	abilityList: {
		alignItems: "flex-end",
	},
	abilityFirst: {
		fontSize: 14,
		color: "#2E2720",
		fontWeight: "500",
		textAlign: "right",
		marginBottom: 2,
	},
	abilityItem: {
		fontSize: 13,
		color: "#7A6E61",
		fontStyle: "italic",
		textAlign: "right",
	},
});
