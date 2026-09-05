import React, { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type Origin, origins } from "@/entities/ancestry";

interface StepOriginProps {
	value: Origin | null;
	onChange: (origin: Origin) => void;
}

export const StepOrigin = ({ value, onChange }: StepOriginProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (origin: Origin) => {
		onChange(origin);
		setIsOpen(false);
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Text style={styles.label}>Походження</Text>

			<TouchableOpacity
				style={styles.trigger}
				onPress={() => setIsOpen((prev) => !prev)}
				activeOpacity={0.7}
			>
				<Text style={value ? styles.triggerText : styles.triggerPlaceholder}>
					{value ? value.origin : "Обери походження..."}
				</Text>
				<Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
			</TouchableOpacity>

			{isOpen && (
				<View style={styles.dropdown}>
					{origins.map((origin) => (
						<TouchableOpacity
							key={origin.id}
							style={[
								styles.option,
								value?.id === origin.id && styles.optionSelected,
							]}
							onPress={() => handleSelect(origin)}
							activeOpacity={0.7}
						>
							<Text
								style={[
									styles.optionText,
									value?.id === origin.id && styles.optionTextSelected,
								]}
							>
								{origin.origin}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}

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
								key={index}
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
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
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
	},
	infoDescription: {
		fontSize: 14,
		color: "#7A6E61",
		fontStyle: "italic",
		marginTop: 12,
		lineHeight: 20,
	},
	abilityBlock: {
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.12)",
		gap: 2,
	},
	abilityFirst: {
		fontSize: 13,
		color: "#2E2720",
		fontWeight: "500",
		marginTop: 4,
	},
	abilityItem: {
		fontSize: 13,
		color: "#7A6E61",
		fontStyle: "italic",
	},
});
