import { StyleSheet, Text, TextInput, View } from "react-native";

interface StepInputProps {
	value: string;
	onChange: (name: string) => void;
}

export const StepInput = ({ value, onChange }: StepInputProps) => {
	return (
		<View>
			<Text style={styles.label}>Ім'я персонажа</Text>
			<TextInput
				style={styles.input}
				onChangeText={onChange}
				placeholder="Арагорн, син Араторна, нащадок Ісільдура..."
				placeholderTextColor="#7A6E61"
				maxLength={100}
				value={value}
				autoFocus
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		color: "#2E2720",
		marginBottom: 8,
	},
	input: {
		borderBottomWidth: 1.5,
		borderBottomColor: "#5B21B6",
		paddingVertical: 18,
		fontSize: 16,
		color: "#2E2720",
		fontStyle: "italic",
	},
});
