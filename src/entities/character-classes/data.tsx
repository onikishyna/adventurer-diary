import type { CharacterClasses, ClassFeature, StatIncrease } from "./types";

export const SUBCLASS_LEVEL = 3;

export const SKILL_POINT_LEVELS = [2, 3];

export const STAT_INCREASES: Record<number, StatIncrease> = {
	4: { pool: "key", count: 1 },
	5: { pool: "secondary", count: 1 },
	8: { pool: "key", count: 1 },
	9: { pool: "secondary", count: 1 },
	12: { pool: "key", count: 1 },
	13: { pool: "secondary", count: 1 },
	16: { pool: "key", count: 1 },
	17: { pool: "secondary", count: 1 },
	20: { pool: "any", count: 2 },
};

const COMMON_FEATURES: ClassFeature[] = [
	{
		title: "EPIC BOON",
		minLevel: 19,
		lines: ["Гейм-майстер видає тобі Epic Boon."],
	},
];

export const heroes: CharacterClasses = [
	{
		id: "berserk",
		background: "Берсерк",
		keyStats: ["STR", "DEX"],
		hitDie: 12,
		startingHP: 20,
		saves: ["STR+", "INT–"],
		armor: "None",
		weapons: ["all STR weapons"],
		startingGear: ["Battleaxe", "Rations", "Rope"],
		features: [
			{
				title: "RAGE (дія, 1/хід)",
				maxLevel: 4,
				lines: [
					"Кинь Fury Die (d4) і відклади його. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще кубик. Якщо вже максимум, кинь новий і вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "RAGE (дія, 1/хід)",
				minLevel: 5,
				maxLevel: 5,
				lines: [
					"Кинь 2 Fury Dice (d4) і відклади їх. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще 2 кубики. Якщо вже максимум, кинь нові й вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "RAGE (дія, 1/хід)",
				minLevel: 6,
				maxLevel: 8,
				lines: [
					"Кинь 2 Fury Dice (d6) і відклади їх. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще 2 кубики. Якщо вже максимум, кинь нові й вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "RAGE (дія, 1/хід)",
				minLevel: 9,
				maxLevel: 12,
				lines: [
					"Кинь 2 Fury Dice (d8) і відклади їх. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще 2 кубики. Якщо вже максимум, кинь нові й вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "RAGE (дія, 1/хід)",
				minLevel: 13,
				maxLevel: 16,
				lines: [
					"Кинь 2 Fury Dice (d10) і відклади їх. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще 2 кубики. Якщо вже максимум, кинь нові й вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "RAGE (дія, 1/хід)",
				minLevel: 17,
				lines: [
					"Кинь 2 Fury Dice (d12) і відклади їх. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще 2 кубики. Якщо вже максимум, кинь нові й вирішуй, які кубики залишити.",
					"Fury Dice рахуються як кубики шкоди проти броні монстрів.",
				],
			},
			{
				title: "THAT ALL YOU GOT?!",
				lines: [
					"Коли тебе атакують, можна скинути 1+ Fury Dice: кожен скинутий кубик зменшує шкоду на STR+DEX.",
				],
			},
			{
				title: "RAGE ЗАКІНЧУЄТЬСЯ, якщо:",
				maxLevel: 17,
				lines: [
					"– ти вийшов з бою;",
					"– ти впав до 0 HP;",
					"– ти цілий раунд не атакував і не робив Rage.",
					"Разом із Rage зникають усі Fury Dice.",
				],
			},
			{
				title: "RAGE ЗАКІНЧУЄТЬСЯ, якщо:",
				minLevel: 18,
				lines: [
					"– ти вийшов з бою;",
					"– ти цілий раунд не атакував і не робив Rage.",
					"Разом із Rage зникають усі Fury Dice.",
				],
			},
			{
				title: "INTENSIFYING FURY",
				minLevel: 2,
				lines: [
					"Якщо на початку твого ходу ти в Rage, безкоштовно кидаєш 1 Fury Die.",
					"Ліміт KEY діє як завжди: якщо вже максимум, кинь новий і вирішуй, які залишити.",
				],
			},
			{
				title: "ONE WITH THE ANCIENTS (1/Safe Rest)",
				minLevel: 2,
				lines: [
					"Коли треба вибрати напрямок чи рішення, можеш звернутися до предків. Вони вкажуть найнебезпечніший або найскладніший шлях.",
				],
			},
			{
				title: "ENDURING RAGE",
				minLevel: 4,
				lines: [
					"Поки ти при смерті (Dying):",
					"– на початку свого ходу автоматично безкоштовно входиш у Rage;",
					"– маєш максимум 2 дії замість 1;",
					"– не робиш STR-збереження, щоб атакувати.",
				],
			},
			{
				title: "WRATH & RUIN",
				minLevel: 4,
				lines: [
					"Коли під час Safe Rest робиш щось помітно руйнівне або демонструєш неабияку силу, можеш змінити свої вибори Берсерка (підклас, Savage Arsenal).",
				],
			},
			{
				title: "DEEP RAGE",
				minLevel: 18,
				lines: ["Падіння до 0 HP більше не закінчує твій Rage."],
			},
			{
				title: "BOUNDLESS RAGE",
				minLevel: 20,
				lines: [
					"Щоразу, коли на Fury Die випадає менше 6, вважай, що випало 6.",
				],
			},
			...COMMON_FEATURES,
		],
		subclasses: [
			{
				id: "mountainheart",
				name: "Path of the Mountainheart",
				tagline: "Непохитний танк, що витримує будь-які удари.",
				features: [
					{
						title: "STONE'S RESILIENCE",
						lines: [
							"Коли скидаєш Fury Dice, щоб зменшити шкоду, додай до зменшення ще й значення кожного скинутого кубика.",
						],
					},
					{
						title: "MOUNTAINOUS TENACITY",
						lines: [
							"Коли витрачаєш Hit Dice на лікування, кожні 10 HP можеш обміняти на зняття 1 Wound.",
						],
					},
					{
						title: "UNBREAKABLE (1/бій)",
						minLevel: 7,
						lines: [
							"Під час Rage, коли ти мав би отримати останній Wound або інший негативний стан на свій вибір, ти його не отримуєш.",
						],
					},
					{
						title: "TITAN'S FURY",
						minLevel: 11,
						lines: [
							"Коли промахуєшся атакою або ворог критує тебе, безкоштовно входиш у Rage.",
						],
					},
					{
						title: "MOUNTAIN'S ENDURANCE",
						minLevel: 15,
						lines: [
							"Поки ти при смерті (Dying), якщо атака по тобі мала б бути критом, її перекидають. Здібності, що спрацьовують від криту (наприклад, Titan's Fury), усе одно спрацьовують.",
						],
					},
				],
			},
			{
				id: "red-mist",
				name: "Path of the Red Mist",
				tagline: "Кривава машина вбивства, що чує кров.",
				features: [
					{
						title: "BLOOD FRENZY (1/хід)",
						lines: [
							"Під час Rage, коли критуєш або вбиваєш ворога, зроби значення 1 Fury Die максимальним.",
						],
					},
					{
						title: "SAVAGE AWARENESS",
						lines: [
							"Advantage на Perception, щоб помітити або вистежити кров.",
							"Під час Rage: Blindsight 2 (ігноруєш Blinded і бачиш крізь темряву та невидимість у цьому радіусі).",
						],
					},
					{
						title: "UNSTOPPABLE BRUTALITY",
						minLevel: 7,
						lines: [
							"Під час Rage можеш отримати 1 Wound, щоб перекинути будь-яку атаку або збереження.",
						],
					},
					{
						title: "OPPORTUNISTIC FRENZY",
						minLevel: 11,
						lines: [
							"Під час Rage атаки при нагоді (opportunity attacks) не мають disadvantage. Також можеш робити їх, коли ворог входить у досяжність твоєї зброї ближнього бою.",
						],
					},
					{
						title: "ONSLAUGHT",
						minLevel: 15,
						lines: [
							"Під час Rage: +2 до швидкості. (1/раунд) Можеш рухатися безкоштовно.",
						],
					},
				],
			},
		],
		choices: [
			{
				id: "savage-arsenal",
				label: "Savage Arsenal",
				sectionTitle: "Savage Arsenal",
				levels: [4, 6, 8, 10, 12, 14, 16],
				options: [
					{
						id: "death-blow",
						title: "DEATH BLOW",
						lines: [
							"Після шкоди від криту можеш скинути будь-яку кількість Fury Dice. Складіть їхні значення й завдай подвійну шкоду.",
						],
					},
					{
						id: "deathless-rage",
						title: "DEATHLESS RAGE (1/хід)",
						lines: [
							"Поки ти при смерті, можеш отримати 1 Wound, щоб отримати 1 дію.",
						],
					},
					{
						id: "eager-for-battle",
						title: "EAGER FOR BATTLE",
						lines: [
							"Advantage на ініціативу. У перший хід кожного бою безкоштовно рухаєшся на 2×DEX клітин.",
						],
					},
					{
						id: "into-the-fray",
						title: "INTO THE FRAY",
						lines: [
							"Дія: стрибни на 2×DEX клітин у бік ворога. Якщо приземлишся поруч щонайменше з 2 ворогами, безкоштовно атакуй одного з них.",
						],
					},
					{
						id: "mighty-endurance",
						title: "MIGHTY ENDURANCE",
						lines: ["Можеш пережити ще 4 Wounds до смерті."],
						bonuses: { maxWounds: 4 },
					},
					{
						id: "more-blood",
						title: "MORE BLOOD!",
						lines: ["Коли ворог критує тебе, отримуєш 1 Fury Die."],
					},
					{
						id: "rampage",
						title: "RAMPAGE (1/хід)",
						lines: [
							"Після влучання можеш вважати, що на наступній атаці цього ходу випало те саме значення (не кидай знову).",
						],
					},
					{
						id: "swift-fury",
						title: "SWIFT FURY",
						lines: [
							"Коли отримуєш 1+ Fury Dice, безкоштовно рухаєшся на DEX клітин, ігноруючи складну місцевість.",
						],
					},
					{
						id: "thunderous-steps",
						title: "THUNDEROUS STEPS",
						lines: [
							"Після руху щонайменше на 4 клітини під час Rage можеш завдати STR дробильної шкоди всім сусіднім істотам там, де зупинився.",
						],
					},
					{
						id: "unstoppable-force",
						title: "UNSTOPPABLE FORCE",
						lines: [
							"Поки ти при смерті й у Rage, шкода дає 1 Wound (замість 2), а крит 2 Wounds (замість 3).",
						],
					},
					{
						id: "whirlwind",
						title: "WHIRLWIND",
						lines: [
							"2 дії: атакуй УСІ цілі в межах досяжності своєї зброї ближнього бою.",
						],
					},
					{
						id: "youre-next",
						title: "YOU'RE NEXT!",
						lines: [
							"Дія, під час Rage: перевірка Might, щоб залякати ворога в межах Reach 12 (DC = його поточні HP). При успіху він одразу тікає з бою.",
						],
					},
				],
			},
		],
	},
	{
		id: "shadowmancer",
		background: "Shadowmancer",
		keyStats: ["INT", "DEX"],
		hitDie: 8,
		startingHP: 13,
		saves: ["INT+", "WIL–"],
		armor: "Cloth Armor",
		resources: [
			{
				id: "mana",
				label: "Мана",
				minLevel: 2,
				max: ({ stats }) => stats.DEX,
			},
		],
		weapons: ["Blades", "Wands"],
		startingGear: ["Adventurer's Garb", "Sickle", "Shovel"],
		features: [
			{
				title: "SHADOW BLAST (некротичний кантрип, дія, 1/хід)",
				lines: ["Дальність 8. Шкода 1d12+KEY."],
			},
			{
				title: "SUMMON SHADOWS (некротичний кантрип)",
				lines: [
					"– Дія: призвати 1 тіньового міньйона в межах Reach 1. Максимум міньйонів = менше з INT і LVL.",
					"– Дія (1/хід): УСІ міньйони рухаються на 6 і атакують (Reach 1, 1d12 кожен).",
				],
			},
			{
				title: "МІНЬЙОНИ",
				lines: [
					"1 HP, без бонусу до шкоди, не критують. Зникають одразу після бою.",
				],
			},
			{
				title: "ЛАЙФХАК",
				lines: [
					"Ти й міньйони вважаєтеся різними істотами. Можеш атакувати сам І скомандувати їм атакувати без штрафу Rushed Attack.",
				],
			},
			{
				title: "MASTER OF DARKNESS",
				minLevel: 2,
				lines: ["Знаєш некротичні кантрипи та некротичні спели 1 тіру."],
			},
			{
				title: "PILFERED POWER",
				minLevel: 2,
				lines: [
					"Мана закінчилась? Кастувати все одно можна, але за кожен такий каст патрон завдає тобі шкоди в ½ максимуму HP.",
				],
			},
			{
				title: "GREEDY PACT",
				minLevel: 12,
				lines: [
					"Коли мав би отримати шкоду від перевитрати Pilfered Power, зроби збереження STR:",
					"– 1–9: отримуєш шкоду як зазвичай (½ максимуму HP);",
					"– 10–19: отримуєш лише 10 шкоди;",
					"– 20+: не отримуєш шкоди, а спел кастується так, ніби він на 1 тір вищий.",
				],
			},
			{
				title: "DIRE SHADOWS",
				minLevel: 17,
				lines: [
					"Атаки по твоїх тіньових міньйонах робляться з disadvantage. Міньйони не отримують шкоди, якщо проходять збереження.",
				],
			},
			{
				title: "ELDRITCH USURPER",
				minLevel: 20,
				lines: [
					"Коли призиваєш одного тіньового міньйона, призивай двох.",
					"Міньйони помирають лише тоді, коли отримують 12 або більше шкоди за один раз.",
				],
			},
			...COMMON_FEATURES,
		],
		subclasses: [
			{
				id: "red-dragon",
				name: "Pact of the Red Dragon",
				tagline: "Твій патрон — червоний дракон. Тіні палають.",
				features: [
					{
						title: "DRACONIC CRIMSON RITE",
						lines: [
							"Знаєш спели школи Fire.",
							"Твої міньйони стають тіньовими драконятами.",
							"Shadow Blast і міньйони можуть завдавати шкоди вогнем або некротичної шкоди. При криті накладають Smoldering.",
						],
					},
					{
						title: "WE'LL ALL BURN!",
						minLevel: 7,
						lines: [
							"Можеш скастувати Pyroclasm без Pilfered Power, якщо включаєш себе в зону шкоди. На своє збереження маєш advantage.",
						],
					},
					{
						title: "HEART OF BURNING FIRE",
						minLevel: 11,
						lines: [
							"На кожному кидку ініціативи лічильник Pilfered Power (мана) отримує +1 тимчасове використання, яке згоряє після бою.",
						],
					},
					{
						title: "ENVELOPED BY THE MASTER",
						minLevel: 15,
						lines: ["Можеш скастувати Dragonform, отримавши 1d4 Wounds."],
					},
				],
			},
			{
				id: "abyssal-depths",
				name: "Pact of the Abyssal Depths",
				tagline: "Твій патрон — крижана істота з глибин. Тіні замерзають.",
				features: [
					{
						title: "MASTER OF NIGHTFROST",
						lines: [
							"Знаєш спели школи Ice.",
							"Можеш дихати під водою.",
							"Твої міньйони стають істотами з нічного льоду.",
							"Shadow Blast і міньйони можуть завдавати шкоди холодом або некротичної шкоди. Коли вони критують, ти отримуєш INT+LVL тимчасових HP.",
						],
					},
					{
						title: "SHADOWFROST",
						minLevel: 7,
						lines: [
							"Твій Shadow Blast також накладає Slowed.",
							"Можеш скастувати Cryosleep або Rimeblades без Pilfered Power, витративши 10 тимчасових HP.",
						],
					},
					{
						title: "GLACIAL RESILIENCE (1/Safe Rest)",
						minLevel: 11,
						lines: [
							"Реакція (коли тебе атакують або ти мав би отримати стан): отримай 10×LVL тимчасових HP і зніми з себе ВСІ негативні стани. Наприкінці твого наступного ходу залишок цих тимчасових HP зникає.",
						],
					},
					{
						title: "CRYOMANCER'S REPRISAL",
						minLevel: 15,
						lines: [
							"Можеш скастувати БУДЬ-ЯКИЙ спел школи Ice, заплативши половину максимуму HP.",
							"Після такого касту отримуєш невидиму ауру: наступна істота, що влучить по тобі атакою ближнього бою в цьому бою, отримує шкоду холодом, рівну половині HP, які ти витратив на цей каст.",
						],
					},
				],
			},
		],
		choices: [
			{
				id: "invocation",
				label: "Lesser Invocation",
				sectionTitle: "Lesser Invocations",
				levels: [3, 8, 11],
				options: [
					{
						id: "abhorrent-speech",
						title: "ABHORRENT SPEECH",
						lines: [
							"Можеш спілкуватися з жахливими істотами (аберації, нежить тощо).",
						],
					},
					{
						id: "beguiling-influence",
						title: "BEGUILING INFLUENCE (1/день)",
						lines: ["Можеш перекинути перевірку Influence."],
					},
					{
						id: "blood-sight",
						title: "BLOOD SIGHT (1/день)",
						lines: [
							"Можеш перекинути перевірку Examination. Також бачиш сліди крові на поверхні, навіть якщо її вже відмили.",
						],
					},
					{
						id: "devoted-acolyte",
						title: "DEVOTED ACOLYTE",
						lines: [
							"Вивчи 2 мови на вибір: Celestial, Draconic, Deep Speak, Infernal або Primordial. Advantage на Lore щодо тем, пов'язаних із цими мовами.",
						],
					},
					{
						id: "eldritch-sense",
						title: "ELDRITCH SENSE",
						lines: [
							"Відчуваєш перевертнів та істот, прихованих магією, у радіусі 6 клітин.",
						],
					},
					{
						id: "gaze-of-two-minds",
						title: "GAZE OF TWO MINDS",
						lines: [
							"Торкнись згодної істоти й сприймай світ її чуттями замість своїх, поки тримаєш концентрацію.",
						],
					},
					{
						id: "knowledge-from-beyond",
						title: "KNOWLEDGE FROM BEYOND",
						lines: [
							"Коли провалюєш перевірку Insight або Arcana, можеш отримати 1 Wound, щоб вона стала успішною.",
						],
					},
					{
						id: "my-favored-pet",
						title: "MY FAVORED PET",
						lines: [
							"Один тіньовий міньйон неохоче терпить тебе й поза боєм. Він може (дуже моторошно) виконувати будь-яку просту роботу, яку зміг би виконати дуже посередній селянин.",
						],
					},
					{
						id: "voice-of-the-dark",
						title: "VOICE OF THE DARK",
						lines: [
							"Можеш телепатично спілкуватися з гуманоїдом у радіусі 6 клітин.",
						],
					},
					{
						id: "whispers-of-the-grave",
						title: "WHISPERS OF THE GRAVE (1/день)",
						lines: [
							"Можеш поставити мертвій істоті 3 питання, на які відповідають «так» або «ні». Цю істоту більше ніколи не можна допитати таким способом.",
						],
					},
				],
			},
			{
				id: "greater-invocation",
				label: "Greater Invocation",
				sectionTitle: "Greater Invocations",
				levels: [4, 6, 9, 14, 18],
				options: [
					{
						id: "armor-of-shadows",
						title: "ARMOR OF SHADOWS",
						lines: [
							"Зменшуй усю отримувану шкоду на кількість своїх міньйонів.",
						],
					},
					{
						id: "fiendish-boon",
						title: "FIENDISH BOON",
						lines: ["+1 до DEX або INT. Максимум Hit Dice на 1 менший."],
					},
					{
						id: "hungering-shadows",
						title: "HUNGERING SHADOWS",
						lines: [
							"Коли твоя тінь критує, наступний тіровий спел у цьому бою не витрачає Pilfered Power.",
						],
					},
					{
						id: "one-with-shadows",
						title: "ONE WITH SHADOWS",
						lines: [
							"Дія: у тьмяному світлі або темряві стаєш невидимим, поки не рухнешся або не атакуєш.",
						],
					},
					{
						id: "repelling-blast",
						title: "REPELLING BLAST",
						lines: [
							"Коли влучаєш Shadow Blast по Medium або меншій істоті, можеш відштовхнути її на 2 клітини від себе.",
						],
					},
					{
						id: "shadow-magus",
						title: "SHADOW MAGUS",
						lines: [
							"Міньйони отримують +4 Reach і завдають d10 шкоди замість d12.",
						],
					},
					{
						id: "shadow-spear",
						title: "SHADOW SPEAR",
						lines: [
							"Shadow Blast б'є вдвічі далі, ігнорує укриття, а по Prone-цілях атакує з advantage (замість disadvantage).",
						],
					},
					{
						id: "shadow-rush",
						title: "SHADOW RUSH",
						lines: [
							"Коли міньйони атакують, будь-хто з них замість кидка може завдати максимальної шкоди й після цього померти.",
						],
					},
					{
						id: "shadow-warp",
						title: "SHADOW WARP",
						lines: [
							"Дія: помінятися місцями з істотою в межах 12 клітин, якій цього ходу завдали некротичної шкоди.",
						],
					},
					{
						id: "swarming-shadows",
						title: "SWARMING SHADOWS",
						lines: [
							"Коли твоя тінь критує, призови ще одного міньйона поруч із ціллю.",
						],
					},
					{
						id: "vengeful-blast",
						title: "VENGEFUL BLAST",
						lines: [
							"Коли міньйон помирає, можеш реакцією скастувати Shadow Blast (навіть якщо вже кастував його цього ходу).",
						],
					},
				],
			},
		],
	},
	{
		id: "stormshifter",
		background: "Stormshifter",
		keyStats: ["WIL", "DEX"],
		hitDie: 8,
		startingHP: 13,
		saves: ["WIL+", "STR–"],
		armor: "Cloth or Leather Armor",
		resources: [
			{
				id: "shapeshift",
				label: "Заряди перетворення",
				max: ({ stats, level, subclassId }) =>
					stats.DEX +
					[6, 9, 12].filter((bonusLevel) => level >= bonusLevel).length +
					(subclassId === "fang-claw" && level >= 15 ? 2 : 0),
			},
			{
				id: "mana",
				label: "Мана",
				minLevel: 2,
				max: ({ stats, level }) => stats.WIL * 3 + level,
			},
		],
		weapons: ["Staves", "Wands"],
		startingGear: ["Cheap Hides", "Staff", "Strange Plant"],
		features: [
			{
				title: "КАНТРИПИ",
				lines: ["Знаєш кантрипи шкіл Lightning і Wind."],
			},
			{
				title: "BEASTSHIFT (дія)",
				lines: [
					"Перетворення на нешкідливу тварину (білка, голуб тощо). У формі можеш говорити з тваринами.",
				],
			},
			{
				title: "ФОРМА ЗАКІНЧУЄТЬСЯ, якщо:",
				lines: [
					"– ти впав до 0 HP;",
					"– ти КАСТУЄШ СПЕЛ;",
					"– ти сам знімаєш її у свій хід (безкоштовно).",
				],
			},
			{
				title: "TINY-ФОРМА",
				lines: [
					"Атаки по тобі з disadvantage, але БУДЬ-ЯКА шкода скасовує форму.",
				],
			},
			{
				title: "СПЕЛИ",
				minLevel: 2,
				lines: ["Відкриваються спели 1 тіру шкіл Wind і Lightning."],
			},
			{
				title: "FEARSOME BEAST (Direbeast Form)",
				minLevel: 2,
				lines: [
					"Тепер Beastshift може перетворити тебе на будь-якого Large звіра.",
					"– Тимчасові HP: DEX+LVL (зникають, коли закінчується форма).",
					"– GORE (дія): 1d6+LVL шкоди. При влучанні отримуєш ще LVL тимчасових HP.",
					"– FEARSOME: коли робиш Interpose або Defend, можеш витратити 1 ману, щоб змусити ворога перекинути атаку. Ти обираєш, який із двох результатів залишити.",
				],
			},
			{
				title: "DIREBEAST FORM: BEAST OF THE PACK (Medium)",
				minLevel: 3,
				lines: [
					"Перетворення на Medium звіра.",
					"– +DEX до швидкості, поки триває форма.",
					"– THUNDERFANG (дія): 1d4+LVL колючої шкоди. Щоразу, коли критуєш або вбиваєш одного чи кількох ворогів, Thunderfang отримує накопичувальні +1d4 шкоди блискавкою до кінця бою.",
					"– SUPERCHARGE: витрать до WIL мани, і наступна атака Thunderfang завдасть додатково 1d8 шкоди блискавкою за кожну витрачену ману. Якщо промахнешся, цю шкоду отримуєш ти сам.",
				],
			},
			{
				title: "BE WILD",
				minLevel: 4,
				lines: [
					"Коли під час Safe Rest проводиш день з дикими тваринами, можеш змінити свої вибори Штормшифтера.",
				],
			},
			{
				title: "DIREBEAST FORM: BEAST OF NIGHTMARES (Tiny)",
				minLevel: 5,
				lines: [
					"Перетворення на будь-якого Tiny звіра чи комаху (за умови, що він жахливий).",
					"– STING (дія, 1/раунд): Reach 0. 1d4 колючої + 3×LVL кислотної шкоди (ігноруючи броню). При криті 4×LVL замість 3×LVL.",
					"– SILENT BUT DEADLY: швидкість 2. Не можеш робити Defend чи Interpose. Нападники не можуть тебе обрати ціллю, поки ти не привернеш увагу (наприклад, тебе побачили під час перетворення або атаки).",
					"– Tiny-форма: атаки по тобі з disadvantage, але БУДЬ-ЯКА шкода скасовує форму.",
				],
			},
			{
				title: "STORMBORN",
				minLevel: 8,
				lines: [
					"Маєш опір до шкоди блискавкою.",
					"(1/день) Можеш отримати advantage на перевірку Naturecraft або на перевірку Concentration.",
				],
			},
			{
				title: "STORMBORN (2)",
				minLevel: 13,
				lines: [
					"Замість кидка кубиків можеш завдати максимальної шкоди спелом школи Wind, витративши 1 заряд Beastshift.",
					"Щоразу, коли закінчуєш Beastshift, можеш безкоштовно скастувати кантрип.",
				],
			},
			{
				title: "ARCHDRUID (1/бій)",
				minLevel: 20,
				lines: [
					"Коли входиш у форму Beastshift або виходиш із неї, можеш безкоштовно скастувати спел до 4 тіру.",
				],
			},
			...COMMON_FEATURES,
		],
		subclasses: [
			{
				id: "sky-storm",
				name: "Circle of Sky & Storm",
				tagline: "Маг стихій: більше спелів і магія навіть у звірячій формі.",
				features: [
					{
						title: "DEEPENING STUDY",
						lines: ["Обери нову школу спелів: Ice або Radiant."],
					},
					{
						title: "CREATURE OF THE FEY",
						lines: [
							"Можеш кастувати спели у звірячій формі (форма більше не закінчується, коли кастуєш спел).",
						],
					},
					{
						title: "ATTUNED TO NATURE (1/день)",
						lines: [
							"Додай LVL до будь-якої перевірки навички, пов'язаної з природою або погодою.",
						],
					},
					{
						title: "RAGING TEMPEST",
						minLevel: 7,
						lines: [
							"Коли критуєш тіровим спелом, можеш безкоштовно скастувати кантрип зі школи, яку знаєш і з якої ще не кастував спелів цього ходу (з тим самим рівнем advantage/disadvantage).",
						],
					},
					{
						title: "PRIMORDIAL FORCE",
						minLevel: 11,
						lines: [
							"Коли витрачаєш 2+ мани на спел, він отримує додатковий ефект залежно від школи:",
							"– Ice: отримай WIL тимчасових HP.",
							"– Lightning: додай WIL до шкоди.",
							"– Radiant: можеш вилікувати істоту в межах 6 клітин на WIL HP.",
							"– Wind: отримай швидкість польоту на цей хід і безкоштовно рухайся на відстань до 6 клітин.",
						],
					},
					{
						title: "MASTER OF STORM",
						minLevel: 15,
						lines: [
							"Можеш одночасно тримати концентрацію на 1 спелі Lightning і 1 спелі Wind.",
							"(1/Safe Rest) Можеш скастувати Ride the Lightning за 0 мани.",
						],
					},
				],
			},
			{
				id: "fang-claw",
				name: "Circle of Fang & Claw",
				tagline: "Звір-перевертень, який б'ється у звірячих формах.",
				features: [
					{
						title: "SWIFTSHIFT",
						lines: [
							"Коли кидаєш ініціативу, можеш безкоштовно перетворитися (Beastshift) або рухатися.",
							"У формі можеш безкоштовно змінювати Direbeast-форми (або реакцією за 1 ману).",
							"Перетворення безкоштовним способом НЕ дає тимчасових HP.",
						],
					},
					{
						title: "WINDBORNE PROTECTOR (1/бій)",
						lines: [
							"Реакція, коли ворог атакує: витрать 2 мани, щоб стати Fearsome Beast. Потім можеш зробити Interpose з відстані до 12 клітин і безкоштовно Defend (якщо ще не робив цього раунду).",
						],
					},
					{
						title: "FRIEND OF BEASTS",
						lines: [
							"Звірі не атакують тебе, поки ти не завдаш їм шкоди.",
							"Перетворення на нешкідливих тварин не витрачає заряд Beastshift.",
						],
					},
					{
						title: "UNLEASH THE BEAST (1/бій)",
						minLevel: 7,
						lines: ["Коли промахуєшся, можеш замість цього критувати."],
					},
					{
						title: "STORM WAKE (1/бій)",
						minLevel: 7,
						lines: [
							"Дія: витрать 3 мани, щоб перетворитися на Beast of the Pack, і телепортуйся по прямій на відстань до 12 клітин. Кожна обрана тобою істота поруч із твоїм шляхом отримує WIL d8 шкоди блискавкою (без кидка на влучання).",
						],
					},
					{
						title: "MASTER OF FORMS",
						minLevel: 11,
						maxLevel: 14,
						lines: ["Твої форми можуть мати 2 Chimeric Boons одночасно."],
					},
					{
						title: "MASTER OF FORMS (2)",
						minLevel: 15,
						lines: [
							"Твої Direbeast-форми можуть мати 3 Chimeric Boons одночасно.",
						],
					},
					{
						title: "VENOMOUS GAZE (1/бій)",
						minLevel: 11,
						lines: [
							"Дія: витрать 2 мани, щоб перетворитися на Beast of Nightmares. Потім обери істоту в межах 12 клітин: вона робить збереження WIL з disadvantage. Якщо провалює, рухається на 2×WIL клітин до тебе й повторює збереження, доки не пройде його або не зможе рухатися далі. Якщо вона опиниться в твоїй клітині, можеш безкоштовно вжалити її (Sting).",
						],
					},
				],
			},
		],
		choices: [
			{
				id: "chimeric-boons",
				label: "Chimeric Boon",
				sectionTitle: "Chimeric Boons",
				levels: [6, 9, 12, 17],
				countAt: { 6: 2 },
				subclassCountAt: { "fang-claw": { 15: 2 } },
				options: [
					{
						id: "beast-of-the-sea",
						title: "BEAST OF THE SEA",
						lines: ["Можеш рухатися, дихати й битися під водою без штрафів."],
					},
					{
						id: "climber",
						title: "CLIMBER",
						lines: [
							"Можеш ходити стінами й стелею. Ігноруєш складну місцевість.",
						],
					},
					{
						id: "earthwalker",
						title: "EARTHWALKER",
						lines: [
							"+2 до Armor. Можеш прориватися крізь землю й необроблений камінь на половині швидкості (залишаючи тунель). Advantage проти стану Prone.",
						],
					},
					{
						id: "fleet-footed",
						title: "FLEET FOOTED",
						lines: [
							"+2 до швидкості. Advantage на Stealth і проти стану Grappled.",
						],
					},
					{
						id: "keen-senses",
						title: "KEEN SENSES",
						lines: [
							"Advantage на Perception та Assess. На тебе не діє Blinded.",
						],
					},
					{
						id: "leader-of-the-pack",
						title: "LEADER OF THE PACK",
						lines: [
							"Advantage проти ефектів страху й зачарування для тебе і союзників у межах 6 клітин.",
						],
					},
					{
						id: "phasebeast",
						title: "PHASEBEAST",
						lines: [
							"Коли переходиш із цієї форми у звичайну (або навпаки), можеш телепортуватися на відстань до 6 клітин у місце, яке бачиш.",
						],
					},
					{
						id: "prehensile-tail",
						title: "PREHENSILE TAIL",
						lines: [
							"Істоти твого розміру або менші, по яких ти влучаєш у ближньому бою, стають Grappled. Якщо влучаєш по більшій істоті, можеш рухатися разом із нею, коли вона рухається.",
						],
					},
					{
						id: "winged",
						title: "WINGED",
						lines: [
							"Отримуєш швидкість польоту. Поки летиш, примусове переміщення відкидає тебе вдвічі далі.",
						],
					},
				],
			},
		],
	},
	{
		id: "ZEPHYR",
		background: "ZEPHYR",
		keyStats: ["DEX", "STR"],
		hitDie: 8,
		startingHP: 13,
		saves: ["DEX+", "INT–"],
		armor: "None",
		defense: ({ stats, level }) =>
			(stats.DEX + stats.STR) * (level >= 13 ? 2 : 1),
		speedBonus: ({ level }) => (level >= 9 ? 4 : level >= 2 ? 2 : 0),
		resources: [
			{
				id: "burst",
				label: "Burst of Speed",
				code: "BURST",
				display: "field",
				minLevel: 2,
				max: ({ stats, level }) => stats.DEX + (level >= 20 ? 1 : 0),
			},
		],
		weapons: ["Melee"],
		startingGear: ["Staff", "Traveling Robes", "Sandals"],
		features: [
			{
				title: "SWIFT FISTS",
				lines: [
					"Удари без зброї: 1d4+STR.",
					"Rushed Attack не накладає на них disadvantage, тож можна бити кілька разів за хід без штрафу.",
				],
			},
			{
				title: "BURST OF SPEED: МАНЕВРИ",
				minLevel: 2,
				lines: [
					"1/хід: витрать 1 заряд, щоб безкоштовно виконати один маневр:",
					"– SLIPSTREAM: робиш Defend, і атака автоматично промахується.",
					"– WHIRLING DEFENSE: робиш Defend, і твій Armor діє проти ВСІХ атак цього раунду.",
					"– SWIFTSTRIKE: атакуєш у свій хід без disadvantage від Rushed Attack.",
					"– WINDSTEP: рухаєшся у свій хід, ігноруючи складну місцевість.",
					"Заряди видаються на кидку ініціативи й згоряють після бою.",
				],
			},
			{
				title: "UNYIELDING RESOLVE",
				minLevel: 4,
				maxLevel: 9,
				lines: [
					"Ігноруй перший Wound, який ти отримав би в кожному бою. Здібності, що спрацьовують від Wound (наприклад, Kinetic Momentum), усе одно спрацьовують.",
				],
			},
			{
				title: "UNYIELDING RESOLVE (2)",
				minLevel: 10,
				maxLevel: 16,
				lines: [
					"Ігноруй перші 2 Wounds, які ти отримав би в кожному бою. Здібності, що спрацьовують від Wound (наприклад, Kinetic Momentum), усе одно спрацьовують.",
				],
			},
			{
				title: "UNYIELDING RESOLVE (3)",
				minLevel: 17,
				lines: [
					"Ігноруй перші 3 Wounds, які ти отримав би в кожному бою. Здібності, що спрацьовують від Wound (наприклад, Kinetic Momentum), усе одно спрацьовують.",
					"Поки ти при смерті (Dying), маєш advantage на збереження STR.",
				],
			},
			{
				title: "FOCUS",
				minLevel: 4,
				lines: [
					"Коли під час Safe Rest медитуєш наодинці у вітряному місці, можеш змінити свої вибори Зефіра.",
				],
			},
			{
				title: "REVERBERATING STRIKES",
				minLevel: 5,
				lines: [
					"Додавай LVL дробильної шкоди до всіх своїх атак ближнього бою.",
				],
			},
			{
				title: "INFUSE STRENGTH",
				minLevel: 6,
				lines: [
					"Дія: зроби удар без зброї по союзнику, щоб передати йому частину своєї сили замість шкоди. Витрать будь-яку кількість своїх Hit Dice і вилікуй його так, як лікуєш себе під час Field Rest (кидаєш кубики й додаєш свій STR до кожного).",
				],
			},
			{
				title: "WINDBORNE",
				minLevel: 20,
				lines: [
					"Ти назавжди отримуєш +1 дію. Поки ти при смерті (Dying), маєш максимум 2 дії.",
				],
			},
			...COMMON_FEATURES,
		],
		subclasses: [
			{
				id: "pain",
				name: "Way of Pain",
				tagline: "Кожен удар по тобі повертається ворогу.",
				features: [
					{
						title: "BRING THE PAIN (1/раунд)",
						lines: [
							"Можеш зробити будь-яку атаку ближнього бою по тобі критом.",
							"Коли тебе критують, шкода зменшується вдвічі, а нападник отримує стільки ж шкоди, скільки ти (ігноруючи броню).",
							"Можеш отримати 1 Wound, щоб подвоїти шкоду, яку отримує ворог.",
						],
					},
					{
						title: "SHARE MY PAIN",
						minLevel: 7,
						lines: [
							"Твій Swiftstrike може також вразити другу істоту в межах Reach 2.",
						],
					},
					{
						title: "PAIN SHARPENS THE MIND",
						minLevel: 11,
						lines: [
							"Поки ти Bloodied, маєш advantage на першу атаку кожного ходу і на всі збереження.",
						],
					},
					{
						title: "ECHOED AGONY",
						minLevel: 15,
						lines: [
							"Твій Swiftstrike може також вразити третю істоту в межах Reach 4.",
						],
					},
				],
			},
			{
				id: "flame",
				name: "Way of Flame",
				tagline: "Твої рани вибухають вогнем.",
				features: [
					{
						title: "EXPLODING SOUL (1/раунд)",
						lines: [
							"У свій хід можеш добровільно отримати 1 Wound.",
							"Щоразу, коли ти отримуєш Wound (будь-яким способом), завдай STR+Wounds шкоди істотам на твій вибір у радіусі 2 клітин (ігноруючи броню) і наклади на них Smoldering.",
						],
					},
					{
						title: "BLAZING SPEED",
						minLevel: 7,
						lines: [
							"+2 до швидкості, поки використовуєш Windstep.",
							"Коли закінчуєш рух з Windstep, вороги, крізь яких ти пройшов, отримують STR+DEX шкоди вогнем. Вороги зі станом Smoldering можуть отримати подвійну шкоду, і тоді стан з них знімається.",
						],
					},
					{
						title: "CHAIN REACTION (1/хід)",
						minLevel: 11,
						lines: [
							"Коли критуєш, завдай STR+Wounds шкоди вогнем істотам на твій вибір у межах 2 клітин від цілі. Повторюй скільки завгодно разів: щоразу обирай нові істоти в межах 2 клітин від будь-якої вже враженої.",
						],
					},
					{
						title: "BURNING SOUL",
						minLevel: 15,
						lines: ["Подвоюй будь-яку шкоду вогнем, яку ти завдаєш."],
					},
				],
			},
		],
		choices: [
			{
				id: "martial-arts",
				label: "Martial Arts",
				sectionTitle: "Martial Arts",
				levels: [4, 6, 8, 10, 12, 14, 16, 18],
				options: [
					{
						id: "airshift",
						title: "AIRSHIFT",
						lines: [
							"Поки ти при тямі, тебе не можна схопити (Grappled). Під час руху можеш пересуватися будь-якою поверхнею як звичайною землею, ігноруючи всі негативні ефекти (стіни, стеля, вода, верхівки дерев, лава, шипи, хмари).",
						],
					},
					{
						id: "blur",
						title: "BLUR (1/бій)",
						lines: [
							"Коли робиш Defend, можеш спочатку відійти на половину швидкості. Якщо після цього ти поза досяжністю або за повним укриттям, шкоди не отримуєш.",
						],
					},
					{
						id: "bodily-discipline",
						title: "BODILY DISCIPLINE",
						lines: [
							"Можеш витратити 1 дію, щоб зняти з себе будь-який стан, крім Wound.",
						],
					},
					{
						id: "enduring-soul",
						title: "ENDURING SOUL",
						lines: [
							"Щоразу на кидку ініціативи отримуєш стільки Hit Dice, скільки дій маєш у свій перший хід. Невикористані зникають після бою.",
						],
					},
					{
						id: "i-jump-on-his-back",
						title: "I JUMP ON HIS BACK!",
						lines: [
							"Коли рухаєшся з Windstep у клітину істоти твого розміру або більшої, можеш застрибнути їй на спину. Поки ти на ній: advantage на атаки ближнього бою по ній, а шкоди, якої ти уникнув, отримує вона.",
						],
					},
					{
						id: "kinetic-barrage",
						title: "KINETIC BARRAGE",
						lines: [
							"Щоразу, коли промахуєшся, отримуєш накопичувальний бонус +STR до всієї шкоди до кінця бою. Дисциплінований майстер бойових мистецтв не промахується навмисно.",
						],
					},
					{
						id: "mighty-soul",
						title: "MIGHTY SOUL",
						lines: [
							"Тебе не можна зрушити проти волі. Коли провалюєш збереження, можеш отримати Wound, щоб додати STR до результату. Можна повторювати скільки завгодно разів.",
						],
					},
					{
						id: "quickstrike",
						title: "QUICKSTRIKE",
						lines: [
							"Коли робиш Interpose, можеш спочатку безкоштовно вдарити ворога без зброї.",
						],
					},
					{
						id: "use-momentum",
						title: "USE MOMENTUM",
						lines: [
							"Коли повністю уникаєш шкоди від атаки ближнього бою (промах або Defend), можеш помінятися місцями з нападником. Потім обери іншу ціль у межах досяжності цієї атаки, і влучають по ній.",
						],
					},
					{
						id: "vital-rejuvenation",
						title: "VITAL REJUVENATION",
						lines: [
							"Коли вперше за хід тебе лікують, можеш вилікувати іншу ціль у межах 6 клітин на STR HP.",
						],
					},
					{
						id: "windstrider",
						title: "WINDSTRIDER",
						lines: [
							"Якщо з Windstep рухаєшся крізь клітину згодної істоти, вона може рухатися з тобою й зупинитися на будь-якій клітині поруч із твоїм шляхом.",
						],
					},
				],
			},
		],
	},
];
