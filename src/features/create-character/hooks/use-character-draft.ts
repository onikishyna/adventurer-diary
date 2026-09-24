import { useState } from "react";
import {
	type CharacterDraft,
	type CreationStep,
	INITIAL_DRAFT,
} from "../types";

export const STEPS: CreationStep[] = [
	"name",
	"origin",
	"background",
	"class",
	"stats",
	"skills",
	"summary",
];

export function useCharacterDraft() {
	const [draft, setDraft] = useState<CharacterDraft>(INITIAL_DRAFT);
	const [currentStep, setCurrentStep] = useState<CreationStep>("name");

	const currentIndex = STEPS.indexOf(currentStep);
	const isFirst = currentIndex === 0;
	const isLast = currentIndex === STEPS.length - 1;

	const goNext = () => {
		if (!isLast) setCurrentStep(STEPS[currentIndex + 1]);
	};

	const goBack = () => {
		if (!isFirst) setCurrentStep(STEPS[currentIndex - 1]);
	};

	const updateDraft = (patch: Partial<CharacterDraft>) => {
		setDraft((prev) => ({ ...prev, ...patch }));
	};

	const reset = () => {
		setDraft(INITIAL_DRAFT);
		setCurrentStep("name");
	};

	return {
		draft,
		currentStep,
		isFirst,
		isLast,
		goNext,
		goBack,
		updateDraft,
		reset,
		currentIndex,
	};
}
