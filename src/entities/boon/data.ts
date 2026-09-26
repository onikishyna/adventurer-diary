import type { ClassChoiceOption } from "@/entities/character-classes";

export interface BoonTier {
	id: "minor" | "major" | "epic";
	label: string;
	boons: ClassChoiceOption[];
}

export const BOON_TIERS: BoonTier[] = [
	{
		id: "minor",
		label: "Minor Boons",
		boons: [
			{
				id: "alert",
				title: "Пильний (Alert)",
				lines: ["+1 до ініціативи."],
				bonuses: { initiative: 1 },
			},
			{
				id: "bright",
				title: "Кмітливий (Bright)",
				lines: ["+1 до максимуму мани."],
				bonuses: { mana: 1 },
			},
			{
				id: "experienced",
				title: "Досвідчений (Experienced)",
				lines: ["+4 HP."],
				bonuses: { maxHP: 4 },
			},
			{
				id: "feisty",
				title: "Завзятий (Feisty)",
				lines: ["+1 до максимуму Hit Dice."],
				bonuses: { hitDice: 1 },
			},
			{
				id: "fiery",
				title: "Полум'яний (Fiery)",
				lines: ["+1 до шкоди вогнем."],
			},
			{
				id: "intrepid",
				title: "Безстрашний (Intrepid)",
				lines: ["+1 до швидкості."],
				bonuses: { speed: 1 },
			},
			{
				id: "skilled",
				title: "Вправний (Skilled)",
				lines: ["+1 очко навичок."],
			},
			{
				id: "simple",
				title: "Простодушний (Simple)",
				lines: ["+1 проти ефектів зачарування (Charm)."],
			},
			{
				id: "stand-tall",
				title: "Високий (Stand Tall)",
				lines: ["Трохи вищий зріст."],
			},
		],
	},
	{
		id: "major",
		label: "Major Boons",
		boons: [
			{
				id: "ancestry-trait",
				title: "Риса походження (Ancestry Trait)",
				lines: ["Отримай ще одну рису раси (якщо це доречно)."],
			},
			{
				id: "aggressive",
				title: "Агресивний (Aggressive)",
				lines: [
					"У перший раунд бою можеш витратити 1 дію зі свого наступного ходу.",
				],
			},
			{
				id: "battle-hardened",
				title: "Загартований у боях (Battle Hardened)",
				lines: ["+2 до Armor."],
				bonuses: { defense: 2 },
			},
			{
				id: "brave",
				title: "Хоробрий (Brave)",
				lines: [
					"+2 до шкоди, поки поруч із тобою більше ворогів, ніж поруч із будь-ким іншим.",
				],
			},
			{
				id: "expansive-mind",
				title: "Широкий розум (Expansive Mind)",
				lines: ["+4 до максимуму мани."],
				bonuses: { mana: 4 },
			},
			{
				id: "good-patient",
				title: "Слухняний пацієнт (Good Patient)",
				lines: ["Коли тебе лікують, відновлюєш додатково KEY HP."],
			},
			{
				id: "hardy",
				title: "Витривалий (Hardy)",
				lines: [
					"Коли кидаєш Hit Dice, щоб збільшити максимум HP, кидай з advantage 2.",
				],
			},
			{
				id: "honorable-protector",
				title: "Шляхетний захисник (Honorable Protector)",
				lines: [
					"Щоразу, коли робиш Interpose, отримуєш LVL тимчасових HP.",
					"Коли союзника в межах 2 клітин атакують, а ти не робиш Interpose, отримуєш LVL психічної шкоди.",
				],
			},
			{
				id: "lionhearted",
				title: "Левове серце (Lionhearted)",
				lines: [
					"+2 до Armor, поки поруч із тобою більше ворогів, ніж поруч із будь-ким іншим.",
				],
			},
			{
				id: "natural-talent",
				title: "Природний талант (Natural Talent)",
				lines: ["Вивчи 1 кантрип зі школи, якої не знаєш."],
			},
			{
				id: "resolute",
				title: "Рішучий (Resolute)",
				lines: [
					"(1/хід) Коли тебе штовхають, відлітаєш на 1 клітину менше. Коли мав би впасти (Prone), можеш натомість відступити на 1 клітину.",
				],
			},
			{
				id: "resilient",
				title: "Незламний (Resilient)",
				lines: [
					"(1/Safe Rest) Коли мав би отримати Wounds, можеш натомість отримати до них імунітет на цей хід.",
				],
			},
			{
				id: "smart-not-book-smart",
				title: "Розумний, але не книжник (Smart, Not Book Smart)",
				lines: [
					"−KEY до максимуму мани.",
					"Щоразу, коли кидаєш ініціативу, отримуєш 1d4 мани; якщо не використав її до кінця бою, вона згоряє.",
				],
				bonuses: { manaPerKey: -1 },
			},
			{
				id: "sniper",
				title: "Снайпер (Sniper)",
				lines: [
					"Advantage на атаки, коли поруч із тобою немає ворогів; інакше disadvantage.",
				],
			},
			{
				id: "stalwart",
				title: "Твердий (Stalwart)",
				lines: ["+1 до максимуму Hit Dice, +2 до Might."],
				bonuses: { hitDice: 1, skills: { might: 2 } },
			},
			{
				id: "tenacious",
				title: "Наполегливий (Tenacious)",
				lines: ["+2 до максимуму Hit Dice."],
				bonuses: { hitDice: 2 },
			},
			{
				id: "tough",
				title: "Міцний (Tough)",
				lines: ["Щоразу, коли отримуєш тимчасові HP, отримуй на 5 більше."],
			},
			{
				id: "unflinching",
				title: "Незворушний (Unflinching)",
				lines: [
					"Твоя зосередженість не зникає навіть перед лицем небезпеки. Advantage на перевірки Concentration.",
				],
			},
			{
				id: "unnatural-talent",
				title: "Неприродний талант (Unnatural Talent)",
				lines: ["Вивчи будь-який 1 Utility-спел."],
			},
			{
				id: "veteran",
				title: "Ветеран (Veteran)",
				lines: ["+10 HP."],
				bonuses: { maxHP: 10 },
			},
		],
	},
	{
		id: "epic",
		label: "EPIC Boons",
		boons: [
			{
				id: "epic-agility",
				title: "Епічна спритність (Epic Agility)",
				lines: ["(1/енкаунтер) Отримай 1 додаткову дію."],
			},
			{
				id: "epic-criticals",
				title: "Епічні крити (Epic Criticals)",
				lines: [
					"Коли кидаєш кубики шкоди криту, можеш замінити один із них на d20.",
				],
			},
			{
				id: "epic-defense",
				title: "Епічний захист (Epic Defense)",
				lines: ["Твої щити дають +3 до Armor."],
			},
			{
				id: "epic-foresight",
				title: "Епічне передбачення (Epic Foresight)",
				lines: [
					"+5 до кидків ініціативи та advantage на першу атаку в кожному енкаунтері.",
				],
				bonuses: { initiative: 5 },
			},
			{
				id: "epic-knowledge",
				title: "Епічне знання (Epic Knowledge)",
				lines: [
					"(1/день) Мить глибокого осяяння: дізнайся приховані відомості про легендарну особу чи предмет.",
				],
			},
			{
				id: "epic-mana",
				title: "Епічна мана (Epic Mana)",
				lines: [
					"Коли тебе лікують, можеш замість цього відновити 1 ману за кожні 5 HP лікування.",
				],
			},
			{
				id: "epic-mind",
				title: "Епічний розум (Epic Mind)",
				lines: ["+8 мани."],
				bonuses: { mana: 8 },
			},
			{
				id: "epic-stamina",
				title: "Епічна витривалість (Epic Stamina)",
				lines: [
					"Під час Field Rest кожен результат 4+ на Hit Die знімає 1 Wound.",
				],
			},
			{
				id: "epic-speed",
				title: "Епічна швидкість (Epic Speed)",
				lines: ["+4 до швидкості та +4 до ініціативи."],
				bonuses: { speed: 4, initiative: 4 },
			},
			{
				id: "epic-stats",
				title: "Епічні характеристики (Epic Stats)",
				lines: ["+1 до трьох різних характеристик."],
			},
			{
				id: "epic-senses",
				title: "Епічні чуття (Epic Senses)",
				lines: ["Отримай Blindsight 6 або Darkvision 16."],
			},
			{
				id: "epic-resistance",
				title: "Епічна стійкість (Epic Resistance)",
				lines: [
					"(1/енкаунтер) Коли мав би отримати шкоду або провалити збереження, можеш вирішити, що цього не стається.",
				],
			},
		],
	},
];
