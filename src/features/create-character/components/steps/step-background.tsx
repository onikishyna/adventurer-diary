import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type Background, backgrounds } from "@/entities/background";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { ChevronLeftIcon } from "@/shared/ui/icons";

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
				style={[
					styles.trigger,
					isOpen && styles.triggerOpen,
					value && styles.triggerAssigned,
				]}
				onPress={() => setIsOpen((prev) => !prev)}
				activeOpacity={0.7}
			>
				<Text style={value ? styles.triggerText : styles.triggerPlaceholder}>
					{value ? value.title : "Обери передісторію..."}
				</Text>
				<ChevronLeftIcon
					size={11}
					color={COLORS.textFaint}
					strokeWidth={2.4}
					style={isOpen ? styles.arrowUp : styles.arrowDown}
				/>
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
		fontFamily: FONTS.bodySemiBold,
		fontSize: 11,
		color: COLORS.textFaint,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 8,
	},

	trigger: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.bgElev,
		padding: 14,
		marginBottom: 4,
	},
	triggerOpen: {
		borderColor: COLORS.text,
	},
	triggerAssigned: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accentSoft10,
	},
	triggerText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 15,
		color: COLORS.text,
	},
	triggerPlaceholder: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 15,
		color: COLORS.textFaint,
	},
	arrowDown: { transform: [{ rotate: "-90deg" }] },
	arrowUp: { transform: [{ rotate: "90deg" }] },

	dropdown: {
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		borderRadius: RADII.lg,
		marginBottom: 16,
		overflow: "hidden",
		backgroundColor: COLORS.bgElev,
	},
	option: {
		padding: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.borderSoft,
	},
	optionSelected: {
		backgroundColor: COLORS.accentSoft10,
	},
	optionText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 15,
		color: COLORS.text,
	},
	optionTextSelected: {
		color: COLORS.accent,
	},

	infoCard: {
		borderWidth: 1,
		borderColor: COLORS.accent,
		borderRadius: RADII.lg,
		padding: 16,
		backgroundColor: COLORS.accentSoft10,
		marginTop: 8,
	},
	infoDescription: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13,
		color: COLORS.textMuted,
		lineHeight: 19,
	},
});
