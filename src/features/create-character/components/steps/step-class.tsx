import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type CharacterClass, heroes } from "@/entities/character-classes";

interface StepClassProps {
	value: CharacterClass | null;
	onChange: (characterClass: CharacterClass) => void;
}

export const StepClass = ({ value, onChange }: StepClassProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (hero: CharacterClass) => {
		onChange(hero);
		setIsOpen(false);
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Text style={styles.label}>Клас</Text>

			<TouchableOpacity
				style={styles.trigger}
				onPress={() => setIsOpen((prev) => !prev)}
				activeOpacity={0.7}
			>
				<Text style={value ? styles.triggerText : styles.triggerPlaceholder}>
					{value ? value.background : "Обери клас..."}
				</Text>
				<Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
			</TouchableOpacity>

			{isOpen && (
				<View style={styles.dropdown}>
					{heroes.map((hero) => (
						<TouchableOpacity
							key={hero.id}
							style={[
								styles.option,
								value?.id === hero.id && styles.optionSelected,
							]}
							onPress={() => handleSelect(hero)}
							activeOpacity={0.7}
						>
							<Text
								style={[
									styles.optionText,
									value?.id === hero.id && styles.optionTextSelected,
								]}
							>
								{hero.background}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}

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
		fontSize: 11,
		color: "#7A6E61",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 8,
	},

	trigger: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: "#2E2720",
		borderRadius: 12,
		padding: 14,
		marginBottom: 4,
	},
	triggerText: {
		fontSize: 16,
		color: "#2E2720",
	},
	triggerPlaceholder: {
		fontSize: 16,
		color: "#7A6E61",
		fontStyle: "italic",
	},
	arrow: {
		fontSize: 10,
		color: "#7A6E61",
	},

	dropdown: {
		borderWidth: 1.5,
		borderColor: "#2E2720",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
	},
	option: {
		padding: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.15)",
	},
	optionSelected: {
		backgroundColor: "rgba(91,33,182,0.06)",
	},
	optionText: {
		fontSize: 16,
		color: "#2E2720",
	},
	optionTextSelected: {
		color: "#5B21B6",
	},

	infoCard: {
		borderWidth: 1.5,
		borderColor: "#5B21B6",
		borderRadius: 12,
		padding: 16,
		backgroundColor: "rgba(91,33,182,0.04)",
		marginTop: 8,
		gap: 0,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.12)",
	},
	infoLabel: {
		fontSize: 13,
		color: "#7A6E61",
	},
	infoValue: {
		fontSize: 13,
		color: "#2E2720",
		textAlign: "right",
		flexShrink: 1,
		marginLeft: 16,
	},

	listBlock: {
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.12)",
		gap: 2,
	},
	listFirst: {
		fontSize: 13,
		color: "#2E2720",
		fontWeight: "500",
		marginTop: 4,
	},
	listItem: {
		fontSize: 13,
		color: "#7A6E61",
		fontStyle: "italic",
	},
});
