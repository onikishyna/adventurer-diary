// Cinzel — headings & labels; Work Sans — body text. Loaded via @expo-google-fonts
// in the root layout (see src/app/_layout.tsx).
export const FONTS = {
	headingMedium: "Cinzel_500Medium",
	headingSemiBold: "Cinzel_600SemiBold",
	headingBold: "Cinzel_700Bold",

	bodyRegular: "WorkSans_400Regular",
	bodyMedium: "WorkSans_500Medium",
	bodySemiBold: "WorkSans_600SemiBold",
	bodyBold: "WorkSans_700Bold",
} as const;

export const RADII = {
	sm: 8,
	md: 10,
	lg: 12,
	xl: 14,
	xxl: 16,
	pill: 999,
} as const;
