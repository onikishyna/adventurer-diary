import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Stat } from "@/entities/character-classes/types";

interface Props {
	value: Record<Stat, number> | null;
	onChange: (stats: Record<Stat, number>) => void;
}

const STATS: Stat[] = ["STR", "DEX", "INT", "WIL"];

const PRESETS = [
	{ label: "Standard", values: [2, 2, 0, -1] },
	{ label: "Balanced", values: [2, 1, 1, 0] },
	{ label: "Min–Max", values: [3, 1, -1, -1] },
];

const formatValue = (val: number) => (val > 0 ? `+${val}` : `${val}`);

export const StepStats = ({ onChange }: Props) => {
	const [selectedPreset, setSelectedPreset] = useState<number[] | null>(null);
	const [assigned, setAssigned] = useState<Partial<Record<Stat, number>>>({});
	const [isPresetOpen, setIsPresetOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<Stat | null>(null);

	const handlePreset = (values: number[]) => {
		setSelectedPreset(values);
		setAssigned({});
		setIsPresetOpen(false);
		setOpenDropdown(null);
	};

	const handleAssign = (stat: Stat, index: number) => {
		const newAssigned = { ...assigned };

		const prevOwner = Object.entries(newAssigned).find(([, i]) => i === index);
		if (prevOwner) delete newAssigned[prevOwner[0] as Stat];

		newAssigned[stat] = index;
		setAssigned(newAssigned);
		setOpenDropdown(null);

		if (selectedPreset && Object.keys(newAssigned).length === STATS.length) {
			const result = {} as Record<Stat, number>;
			for (const s of STATS) {
				result[s] = selectedPreset[newAssigned[s]!];
			}
			onChange(result);
		}
	};

	return (
		<View>
			<Text style={styles.label}>Обери розподіл</Text>

			<TouchableOpacity
				style={[
					styles.trigger,
					isPresetOpen && styles.triggerOpen,
					selectedPreset && styles.triggerAssigned,
				]}
				onPress={() => setIsPresetOpen((prev) => !prev)}
				activeOpacity={0.7}
			>
				<Text
					style={[
						styles.triggerText,
						!selectedPreset && styles.triggerPlaceholder,
						selectedPreset && styles.triggerAssignedText,
					]}
				>
					{selectedPreset
						? `${PRESETS.find((p) => p.values === selectedPreset)?.label}:  ${selectedPreset.map(formatValue).join(",  ")}`
						: "Обери розподіл..."}
				</Text>
				<Text style={styles.arrow}>{isPresetOpen ? "▲" : "▼"}</Text>
			</TouchableOpacity>

			{isPresetOpen && (
				<View style={styles.dropdown}>
					{PRESETS.map((preset) => (
						<TouchableOpacity
							key={preset.label}
							style={[
								styles.option,
								selectedPreset === preset.values && styles.optionSelected,
							]}
							onPress={() => handlePreset(preset.values)}
							activeOpacity={0.7}
						>
							<Text
								style={[
									styles.optionText,
									selectedPreset === preset.values && styles.optionTextSelected,
								]}
							>
								{preset.label}
							</Text>
							<Text
								style={[
									styles.presetValues,
									selectedPreset === preset.values &&
										styles.presetValuesSelected,
								]}
							>
								{preset.values.map(formatValue).join(",  ")}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}

			{selectedPreset && (
				<View style={styles.statsBlock}>
					<Text style={styles.label}>Розподіли очки</Text>

					{STATS.map((stat) => (
						<View key={stat}>
							<View style={styles.statRow}>
								<Text style={styles.statName}>{stat}</Text>

								<TouchableOpacity
									style={[
										styles.trigger,
										styles.statTrigger,
										openDropdown === stat && styles.triggerOpen,
										assigned[stat] !== undefined && styles.triggerAssigned,
									]}
									onPress={() =>
										setOpenDropdown((prev) => (prev === stat ? null : stat))
									}
									activeOpacity={0.7}
								>
									<Text
										style={[
											styles.triggerText,
											assigned[stat] === undefined && styles.triggerPlaceholder,
											assigned[stat] !== undefined &&
												styles.triggerAssignedText,
										]}
									>
										{assigned[stat] !== undefined
											? formatValue(selectedPreset[assigned[stat]!])
											: "обери..."}
									</Text>
									<Text style={styles.arrow}>
										{openDropdown === stat ? "▲" : "▼"}
									</Text>
								</TouchableOpacity>
							</View>

							{openDropdown === stat && (
								<View style={[styles.dropdown, styles.statDropdown]}>
									{selectedPreset
										.map((val, index) => ({ val, index }))
										.filter(({ index }) => {
											const assignedToOther = Object.entries(assigned).some(
												([s, i]) => i === index && s !== stat,
											);
											return !assignedToOther;
										})
										.map(({ val, index }) => (
											<TouchableOpacity
												key={index}
												style={[
													styles.option,
													assigned[stat] === index && styles.optionSelected,
												]}
												onPress={() => handleAssign(stat, index)}
												activeOpacity={0.7}
											>
												<Text
													style={[
														styles.optionText,
														assigned[stat] === index &&
															styles.optionTextSelected,
													]}
												>
													{formatValue(val)}
												</Text>
											</TouchableOpacity>
										))}
								</View>
							)}
						</View>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 11,
		color: "#7A6E61",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 12,
	},

	statsBlock: {
		marginTop: 24,
		gap: 4,
	},
	statRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	statName: {
		fontSize: 15,
		color: "#2E2720",
		fontWeight: "500",
		letterSpacing: 1,
		width: 40,
	},

	trigger: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1.5,
		borderColor: "rgba(46,39,32,0.3)",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	statTrigger: {
		width: 140,
	},
	triggerOpen: {
		borderColor: "#2E2720",
	},
	triggerAssigned: {
		borderColor: "#5B21B6",
		backgroundColor: "rgba(91,33,182,0.06)",
	},
	triggerText: {
		fontSize: 15,
		color: "#2E2720",
	},
	triggerPlaceholder: {
		color: "#7A6E61",
		fontStyle: "italic",
	},
	triggerAssignedText: {
		color: "#5B21B6",
		fontWeight: "500",
	},
	arrow: {
		fontSize: 10,
		color: "#7A6E61",
	},

	dropdown: {
		borderWidth: 1.5,
		borderColor: "#2E2720",
		borderRadius: 10,
		marginTop: 4,
		marginBottom: 8,
		overflow: "hidden",
	},
	statDropdown: {
		marginLeft: 56,
	},
	option: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.15)",
	},
	optionSelected: {
		backgroundColor: "rgba(91,33,182,0.06)",
	},
	optionText: {
		fontSize: 15,
		color: "#2E2720",
	},
	optionTextSelected: {
		color: "#5B21B6",
		fontWeight: "500",
	},
	presetValues: {
		fontSize: 13,
		color: "#7A6E61",
		fontStyle: "italic",
	},
	presetValuesSelected: {
		color: "#5B21B6",
	},
});
