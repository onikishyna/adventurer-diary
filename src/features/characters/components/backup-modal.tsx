import { useState } from "react";
import {
	Modal,
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { parseBackup, serializeBackup } from "@/features/characters/backup";
import { useCharacters } from "@/features/characters/use-characters-context";
import { COLORS, FONTS, RADII } from "@/shared/theme";

interface BackupModalProps {
	visible: boolean;
	onClose: () => void;
}

const isWeb = Platform.OS === "web";

function downloadFile(fileName: string, text: string) {
	const blob = new Blob([text], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(url);
}

function pickTextFile(): Promise<string | null> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json,.json,.txt";
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return resolve(null);
			file
				.text()
				.then(resolve)
				.catch(() => resolve(null));
		};
		input.click();
	});
}

export function BackupModal({ visible, onClose }: BackupModalProps) {
	const { characters, importCharacters } = useCharacters();
	const [importText, setImportText] = useState("");
	const [message, setMessage] = useState<{
		text: string;
		isError: boolean;
	} | null>(null);

	const handleClose = () => {
		setImportText("");
		setMessage(null);
		onClose();
	};

	const backupText = serializeBackup(characters);
	const fileName = `nimble-sheet-${new Date().toISOString().slice(0, 10)}.json`;

	const handleShare = async () => {
		try {
			await Share.share({ title: fileName, message: backupText });
		} catch {
			setMessage({
				text: "Не вдалося поділитися. Спробуй завантажити файл.",
				isError: true,
			});
		}
	};

	const applyImport = (text: string) => {
		const result = parseBackup(text);
		if ("error" in result) {
			setMessage({ text: result.error, isError: true });
			return;
		}
		const { added, updated } = importCharacters(result.characters);
		setImportText("");
		setMessage({
			text: `Готово: додано ${added}, оновлено ${updated}.`,
			isError: false,
		});
	};

	const handlePickFile = async () => {
		const text = await pickTextFile();
		if (text !== null) applyImport(text);
	};

	const canShare =
		!isWeb || (typeof navigator !== "undefined" && "share" in navigator);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<ScrollView
						style={styles.scroll}
						contentContainerStyle={styles.content}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<Text style={styles.title}>Резервна копія</Text>
						<Text style={styles.message}>
							Персонажі зберігаються лише на цьому пристрої. Збережи копію, щоб
							не втратити їх або перенести на інший телефон.
						</Text>

						<Text style={styles.sectionTitle}>Експорт</Text>
						<Text style={styles.hint}>Персонажів: {characters.length}</Text>
						{isWeb && (
							<TouchableOpacity
								style={styles.primaryButton}
								onPress={() => downloadFile(fileName, backupText)}
								activeOpacity={0.85}
								disabled={characters.length === 0}
							>
								<Text style={styles.primaryText}>Завантажити файл</Text>
							</TouchableOpacity>
						)}
						{canShare && (
							<TouchableOpacity
								style={isWeb ? styles.secondaryButton : styles.primaryButton}
								onPress={handleShare}
								activeOpacity={0.85}
								disabled={characters.length === 0}
							>
								<Text style={isWeb ? styles.secondaryText : styles.primaryText}>
									Поділитися
								</Text>
							</TouchableOpacity>
						)}

						<Text style={styles.sectionTitle}>Імпорт</Text>
						<Text style={styles.hint}>
							Персонажі з копії додаються до наявних; ті, що вже є, оновлюються.
						</Text>
						{isWeb && (
							<TouchableOpacity
								style={styles.secondaryButton}
								onPress={handlePickFile}
								activeOpacity={0.85}
							>
								<Text style={styles.secondaryText}>Відкрити файл</Text>
							</TouchableOpacity>
						)}
						<TextInput
							style={styles.input}
							value={importText}
							onChangeText={setImportText}
							placeholder="…або встав сюди текст копії"
							placeholderTextColor={COLORS.textFaint}
							multiline
							autoCorrect={false}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={[
								styles.secondaryButton,
								!importText.trim() && styles.buttonDisabled,
							]}
							onPress={() => applyImport(importText)}
							activeOpacity={0.85}
							disabled={!importText.trim()}
						>
							<Text style={styles.secondaryText}>Імпортувати текст</Text>
						</TouchableOpacity>

						{message && (
							<Text
								style={[
									styles.result,
									message.isError ? styles.resultError : styles.resultOk,
								]}
							>
								{message.text}
							</Text>
						)}
					</ScrollView>

					<TouchableOpacity
						style={styles.closeButton}
						onPress={handleClose}
						activeOpacity={0.8}
					>
						<Text style={styles.closeText}>Закрити</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(8,4,2,0.72)",
		alignItems: "center",
		justifyContent: "center",
		padding: 28,
	},
	card: {
		width: "100%",
		maxWidth: 340,
		maxHeight: "90%",
		borderRadius: RADII.xxl,
		backgroundColor: COLORS.bgElev,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		padding: 22,
		gap: 12,
	},
	scroll: {
		flexShrink: 1,
	},
	content: {
		gap: 10,
	},
	title: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 18,
		color: COLORS.text,
	},
	message: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 13.5,
		color: COLORS.textMuted,
		lineHeight: 20,
	},
	sectionTitle: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 12,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		color: COLORS.textFaint,
		marginTop: 8,
	},
	hint: {
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.textMuted,
		lineHeight: 18,
	},
	primaryButton: {
		height: 44,
		borderRadius: RADII.lg,
		backgroundColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},
	primaryText: {
		fontFamily: FONTS.headingSemiBold,
		fontSize: 14,
		color: COLORS.onAccent,
	},
	secondaryButton: {
		height: 44,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.accent,
		alignItems: "center",
		justifyContent: "center",
	},
	secondaryText: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 14,
		color: COLORS.accent,
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	input: {
		minHeight: 80,
		maxHeight: 140,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		backgroundColor: COLORS.bgElev2,
		padding: 12,
		fontFamily: FONTS.bodyRegular,
		fontSize: 12.5,
		color: COLORS.text,
		textAlignVertical: "top",
		// biome-ignore lint/suspicious/noExplicitAny: web-only RN style prop
		outlineStyle: "none" as any,
	},
	result: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 13,
		lineHeight: 19,
	},
	resultOk: {
		color: COLORS.accent,
	},
	resultError: {
		color: COLORS.crimson,
	},
	closeButton: {
		height: 46,
		borderRadius: RADII.lg,
		borderWidth: 1,
		borderColor: COLORS.borderSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	closeText: {
		fontFamily: FONTS.bodySemiBold,
		fontSize: 14,
		color: COLORS.textMuted,
	},
});
