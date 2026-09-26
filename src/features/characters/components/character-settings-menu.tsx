import type { ComponentType } from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { COLORS, FONTS, RADII } from "@/shared/theme";
import {
	CloseIcon,
	type IconProps,
	PlusIcon,
	SparkleIcon,
} from "@/shared/ui/icons";

export interface MenuAnchor {
	// window coordinates of the button the menu drops down from
	top: number;
	right: number;
}

interface Props {
	anchor: MenuAnchor | null;
	onClose: () => void;
	onLevelUp: () => void;
	onBoons: () => void;
	onDelete: () => void;
}

interface MenuItemProps {
	label: string;
	icon: ComponentType<IconProps>;
	destructive?: boolean;
	onPress: () => void;
}

function MenuItem({ label, icon: Icon, destructive, onPress }: MenuItemProps) {
	const color = destructive ? COLORS.crimson : COLORS.text;
	return (
		<TouchableOpacity
			style={styles.item}
			onPress={onPress}
			activeOpacity={0.7}
			accessibilityRole="button"
		>
			<View style={styles.itemIcon}>
				<Icon size={12} color={color} strokeWidth={2.2} />
			</View>
			<Text style={[styles.itemLabel, { color }]}>{label}</Text>
		</TouchableOpacity>
	);
}

// dropdown under the sheet's top-right settings icon; the modal covers the
// whole window (stack header included), so it's positioned from the
// button's measured window coordinates rather than a fixed offset
export function CharacterSettingsMenu({
	anchor,
	onClose,
	onLevelUp,
	onBoons,
	onDelete,
}: Props) {
	return (
		<Modal
			visible={!!anchor}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.backdrop} onPress={onClose}>
				<View
					style={[
						styles.menu,
						{ top: (anchor?.top ?? 0) + 6, right: anchor?.right ?? 20 },
					]}
				>
					<MenuItem label="Левел ап" icon={PlusIcon} onPress={onLevelUp} />
					<MenuItem label="Boons" icon={SparkleIcon} onPress={onBoons} />
					<View style={styles.divider} />
					<MenuItem
						label="Видалити персонажа"
						icon={CloseIcon}
						destructive
						onPress={onDelete}
					/>
				</View>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(8,4,2,0.45)",
	},
	menu: {
		position: "absolute",
		minWidth: 220,
		borderRadius: RADII.xl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		paddingVertical: 6,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	itemIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.bgElev2,
		alignItems: "center",
		justifyContent: "center",
	},
	itemLabel: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 14,
	},
	divider: {
		height: 1,
		marginHorizontal: 14,
		backgroundColor: COLORS.borderSoft,
	},
});
