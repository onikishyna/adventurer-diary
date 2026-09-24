import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import { PersonIcon } from "@/shared/ui/icons";

interface StepInputProps {
	value: string;
	onChange: (name: string) => void;
}

const MAX_LENGTH = 100;

export const StepInput = ({ value, onChange }: StepInputProps) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View style={styles.container}>
			<View style={styles.avatar}>
				<PersonIcon size={42} color={COLORS.accent} strokeWidth={1.4} />
			</View>

			<View style={styles.field}>
				<Text style={styles.label}>Ім'я персонажа</Text>
				<View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
					<TextInput
						style={styles.input}
						onChangeText={onChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						placeholder="Арагорн, син Араторна..."
						placeholderTextColor={COLORS.textFaint}
						maxLength={MAX_LENGTH}
						value={value}
						autoFocus
					/>
				</View>
				<View style={styles.helperRow}>
					<Text style={styles.helperText}>Це ім'я бачитимуть інші гравці</Text>
					<Text style={styles.helperText}>
						{value.length} / {MAX_LENGTH}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingTop: 12,
		gap: 28,
	},

	avatar: {
		width: 84,
		height: 84,
		borderRadius: 42,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 2,
		borderColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},

	field: {
		width: "100%",
		gap: 8,
	},
	label: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 12,
		letterSpacing: 0.5,
		textTransform: "uppercase",
		color: COLORS.textFaint,
	},
	inputBox: {
		width: "100%",
		minHeight: 54,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	inputBoxFocused: {
		borderColor: COLORS.accent,
	},
	input: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 17,
		color: COLORS.text,
		paddingVertical: 0,
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	helperRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	helperText: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 11,
		color: COLORS.textFaint,
	},
});
