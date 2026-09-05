import React, { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type Background, backgrounds } from "@/entities/background";

interface StepBackgroundProps {
	value: Background | null;
	onChange: (background: Background) => void;
}

export const StepBackground = ({ value, onChange }: StepBackgroundProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (background: Background) => {
		onChange(background);
		setIsOpen(false);
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Text style={styles.label}>Передісторія</Text>

			<TouchableOpacity
				style={styles.trigger}
				onPress={() => setIsOpen((prev) => !prev)}
				activeOpacity={0.7}
			>
				<Text style={value ? styles.triggerText : styles.triggerPlaceholder}>
					{value ? value.title : "Обери передісторію..."}
				</Text>
				<Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
			</TouchableOpacity>

			{isOpen && (
				<View style={styles.dropdown}>
					{backgrounds.map((background) => (
						<TouchableOpacity
							key={background.id}
							style={[
								styles.option,
								value?.id === background.id && styles.optionSelected,
							]}
							onPress={() => handleSelect(background)}
							activeOpacity={0.7}
						>
							<Text
								style={[
									styles.optionText,
									value?.id === background.id && styles.optionTextSelected,
								]}
							>
								{background.title}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}

			{value && (
				<View style={styles.infoCard}>
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
		gap: 8,
	},
	infoTitle: {
		fontSize: 15,
		color: "#2E2720",
		fontWeight: "500",
	},
	infoDescription: {
		fontSize: 14,
		color: "#7A6E61",
		fontStyle: "italic",
		lineHeight: 20,
	},
});
