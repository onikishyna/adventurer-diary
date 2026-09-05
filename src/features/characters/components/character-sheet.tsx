// features/character/components/CharacterSheet.tsx
import React, { useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { originImages } from "@/entities/ancestry";
import type { Character } from "@/entities/character/types";

interface Props {
	character: Character;
	onClose: () => void;
}

const STATS = ["STR", "DEX", "INT", "WIL"] as const;
const MAX_WOUNDS = 5;

export const CharacterSheet = ({ character, onClose }: Props) => {
	const [wounds, setWounds] = useState(0);

	const toggleWound = (index: number) => {
		if (wounds === index + 1) {
			setWounds(index); // знімаємо останню рану
		} else {
			setWounds(index + 1);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* хедер з кнопкою закрити */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={onClose}
						accessibilityLabel="Закрити"
					>
						<Text style={styles.closeIcon}>✕</Text>
					</TouchableOpacity>
				</View>

				{/* картинка і ім'я */}
				<View style={styles.hero}>
					<Image
						source={originImages[character.origin.id]}
						style={styles.image}
					/>
					<Text style={styles.name}>{character.name}</Text>
					<Text style={styles.origin}>{character.origin.origin}</Text>
				</View>

				<View style={styles.divider} />

				{/* основна інфо */}
				<View style={styles.section}>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Клас</Text>
						<Text style={styles.infoValue}>
							{character.characterClass.background}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Рівень</Text>
						<Text style={styles.infoValue}>{character.level}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>HP</Text>
						<Text style={styles.infoValue}>
							{character.currentHP} / {character.maxHP}
						</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* стати */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Характеристики</Text>
					<View style={styles.statsGrid}>
						{STATS.map((stat) => (
							<View key={stat} style={styles.statCard}>
								<Text style={styles.statValue}>
									{character.stats[stat] >= 0
										? `+${character.stats[stat]}`
										: `${character.stats[stat]}`}
								</Text>
								<Text style={styles.statName}>{stat}</Text>
							</View>
						))}
					</View>
				</View>

				<View style={styles.divider} />

				{/* рани */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Рани</Text>
					<View style={styles.wounds}>
						{Array.from({ length: MAX_WOUNDS }).map((_, index) => (
							<TouchableOpacity
								key={index}
								style={[styles.wound, index < wounds && styles.woundFilled]}
								onPress={() => toggleWound(index)}
								activeOpacity={0.7}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2EBDE",
	},

	header: {
		paddingTop: 16,
		paddingHorizontal: 28,
		alignItems: "flex-end",
	},
	closeButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#23202E",
		alignItems: "center",
		justifyContent: "center",
	},
	closeIcon: {
		color: "#F2EBDE",
		fontSize: 16,
	},

	// герой
	hero: {
		alignItems: "center",
		paddingTop: 16,
		paddingBottom: 32,
	},
	image: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(46,39,32,0.06)",
		marginBottom: 20,
	},
	name: {
		fontSize: 26,
		fontWeight: "600",
		color: "#12131A",
		letterSpacing: 2,
		textTransform: "uppercase",
		marginBottom: 6,
	},
	origin: {
		fontSize: 15,
		fontStyle: "italic",
		color: "#7A6E61",
	},

	divider: {
		height: 1.5,
		backgroundColor: "#5B21B6",
		opacity: 0.2,
		marginHorizontal: 28,
		marginVertical: 4,
	},

	section: {
		paddingHorizontal: 28,
		paddingVertical: 20,
	},
	sectionTitle: {
		fontSize: 11,
		color: "#7A6E61",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 16,
	},

	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(46,39,32,0.12)",
	},
	infoLabel: {
		fontSize: 15,
		color: "#7A6E61",
	},
	infoValue: {
		fontSize: 15,
		color: "#2E2720",
		fontWeight: "500",
	},

	// стати
	statsGrid: {
		flexDirection: "row",
		gap: 12,
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 16,
		borderWidth: 1.5,
		borderColor: "rgba(46,39,32,0.15)",
		borderRadius: 12,
		backgroundColor: "#FAF6EE",
	},
	statValue: {
		fontSize: 22,
		fontWeight: "600",
		color: "#5B21B6",
		marginBottom: 4,
	},
	statName: {
		fontSize: 11,
		color: "#7A6E61",
		letterSpacing: 1,
		textTransform: "uppercase",
	},

	// рани
	wounds: {
		flexDirection: "row",
		gap: 12,
	},
	wound: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 1.5,
		borderColor: "#2E2720",
		backgroundColor: "transparent",
	},
	woundFilled: {
		backgroundColor: "#2E2720",
	},
});
