import type { CharacterClasses } from "./types";

// the level at which every class picks one of its subclasses
export const SUBCLASS_LEVEL = 3;

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
				lines: [
					"Кинь Fury Die (d4) і відклади його. Усі відкладені Fury Dice додаються до КОЖНОЇ атаки через STR.",
					"Максимум Fury Dice = KEY. Rage можна робити повторно, щоб отримати ще кубик. Якщо вже максимум, кинь новий і вирішуй, які кубики залишити.",
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
				lines: [
					"– ти вийшов з бою;",
					"– ти впав до 0 HP;",
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
				max: ({ stats }) => stats.DEX,
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
		defenseStats: ["STR", "DEX"],
		speedBonus: ({ level }) => (level >= 2 ? 2 : 0),
		resources: [
			{
				id: "burst",
				label: "Burst of Speed",
				code: "BURST",
				display: "field",
				minLevel: 2,
				max: ({ stats }) => stats.DEX,
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
				],
			},
		],
	},
];
