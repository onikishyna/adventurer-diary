import type { CharacterClasses, StatIncrease } from "./types";

// the level at which every class picks one of its subclasses
export const SUBCLASS_LEVEL = 3;

// levels whose level-up grants one skill point
export const SKILL_POINT_LEVELS = [2, 3];

// levels whose level-up grants +1 to stats: `pool` is which stats can be
// picked ("key" = the class's key stats, "secondary" = the other two,
// "any" = all four), `count` how many different ones get +1
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
		choices: [
			{
				id: "invocation",
				label: "Інвокація",
				sectionTitle: "Інвокації",
				levels: [3],
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
			{
				title: "BE WILD",
				minLevel: 4,
				lines: [
					"Коли під час Safe Rest проводиш день з дикими тваринами, можеш змінити свої вибори Штормшифтера.",
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
			{
				title: "UNYIELDING RESOLVE",
				minLevel: 4,
				lines: [
					"Ігноруй перший Wound, який ти отримав би в кожному бою. Здібності, що спрацьовують від Wound (наприклад, Kinetic Momentum), усе одно спрацьовують.",
				],
			},
			{
				title: "FOCUS",
				minLevel: 4,
				lines: [
					"Коли під час Safe Rest медитуєш наодинці у вітряному місці, можеш змінити свої вибори Зефіра.",
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
