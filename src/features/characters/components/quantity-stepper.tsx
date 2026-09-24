import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "@/shared/theme";
import { MinusIcon, PlusIcon } from "@/shared/ui/icons";

interface QuantityStepperProps {
	value: number;
	// +/- adjust relative to whatever the current stored value is — the
	// caller must apply these against fresh state (e.g. a functional
	// updater), not against the `value` prop, so rapid taps in the same
	// render pass don't clobber each other
	onIncrement: () => void;
	onDecrement: () => void;
	// manual text edit always commits an absolute, user-typed value
	onChangeValue: (next: number) => void;
	min?: number;
}

// a −/+ stepper whose value is also a manually-editable text field — typing a
// number and blurring commits it (clamped to `min`); an invalid/empty value
// reverts to the last committed one
export function QuantityStepper({
	value,
	onIncrement,
	onDecrement,
	onChangeValue,
	min = 1,
}: QuantityStepperProps) {
	const [text, setText] = useState(String(value));
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		setText(String(value));
	}, [value]);

	const handleBlur = () => {
		setIsFocused(false);
		const trimmed = text.trim();
		const parsed = Number.parseInt(trimmed, 10);
		if (trimmed === "" || Number.isNaN(parsed)) {
			setText(String(value));
			return;
		}
		const clamped = Math.max(min, parsed);
		onChangeValue(clamped);
		setText(String(clamped));
	};

	return (
		<View style={styles.stepper}>
			<TouchableOpacity
				style={styles.stepperButton}
				onPress={onDecrement}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Зменшити кількість"
			>
				<MinusIcon size={11} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
			<TextInput
				style={[
					styles.quantityInput,
					isFocused ? styles.quantityInputFocused : styles.quantityInputIdle,
				]}
				value={text}
				onChangeText={setText}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				keyboardType="number-pad"
				maxLength={4}
				selectTextOnFocus
			/>
			<TouchableOpacity
				style={styles.stepperButton}
				onPress={onIncrement}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityLabel="Збільшити кількість"
			>
				<PlusIcon size={11} color={COLORS.textMuted} strokeWidth={2.4} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepperButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.bgElev2,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	quantityInput: {
		width: 32,
		flexGrow: 0,
		flexShrink: 0,
		textAlign: "center",
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: COLORS.accent,
		paddingHorizontal: 0,
		paddingVertical: 2,
		borderBottomWidth: 1.5,
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	quantityInputIdle: {
		borderStyle: "dashed",
		borderBottomColor: COLORS.accentSoft35,
	},
	quantityInputFocused: {
		borderStyle: "solid",
		borderBottomColor: COLORS.accent,
	},
});
