import {
	Modal,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { COLORS, FONTS } from "@/shared/theme";
import { ChevronLeftIcon } from "@/shared/ui/icons";
import { SpellsBrowser } from "./spells-browser";

interface SpellPickerModalProps {
	visible: boolean;
	selectedIds: string[];
	onToggleSpell: (spellId: string) => void;
	onClose: () => void;
}

export function SpellPickerModal({
	visible,
	selectedIds,
	onToggleSpell,
	onClose,
}: SpellPickerModalProps) {
	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<SafeAreaView style={styles.container}>
				<View style={styles.topBar}>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={onClose}
						accessibilityLabel="Закрити"
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<ChevronLeftIcon
							size={20}
							color={COLORS.textMuted}
							strokeWidth={1.8}
						/>
					</TouchableOpacity>
					<Text style={styles.topBarTitle}>Додати заклинання</Text>
					<View style={styles.iconButton} />
				</View>

				<SpellsBrowser
					selectedIds={selectedIds}
					onToggleSpell={onToggleSpell}
				/>
			</SafeAreaView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},
	topBar: {
		paddingTop: 12,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconButton: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	topBarTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		letterSpacing: 1,
		textTransform: "uppercase",
		color: COLORS.textMuted,
	},
});
