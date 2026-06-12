// ──────────────────────────────────────────────────────────────────────────────
// The three paths of approach. Each path is a "mode" the Library is arranged by,
// mapped onto the 三才 (sancai): Heaven / Human / Earth.
//
// Consumed by src/pages/{dao,de,zion}.astro via the PathArticle component,
// by src/pages/library.astro for the triad cards, and by src/pages/[path]/[slug].astro
// for the per-text "leaf" pages.
//
// Each book:
//   slug    — URL segment for its leaf page (/{path}/{slug}); required, unique within a path
//   title   — display name
//   note    — edition / translator line
//   href    — purchase or read link; leave "" for none
//   why     — one or two sentences on why this text sits in this section (optional)
//   epithet — a short emblem-phrase shown above the title on the leaf (optional)
//   quote   — { text, cite } a key passage for the leaf (optional)
//   echoes  — [{ path, slug, title, note }] cross-path resonances — the same structure
//             in another tradition's images (metaphorical isomorphism made navigable)
// ──────────────────────────────────────────────────────────────────────────────

export const paths = {
  dao: {
    slug: 'dao',
    name: 'Dao',
    subtitle: 'The Way',
    glyph: '天',
    sancai: 'Heaven — the way of what is above',
    triadBlurb:
      'Texts of alignment, action, release, discipline, and forms of life less governed by coercion and fear.',
    lede:
      'This path concerns alignment before ideology: how one moves, yields, acts, refrains, and learns to live without forcing the world into a shape it will not keep.',
    statement:
      'Many begin here after discovering that inherited structures gave coherence at the cost of continual inner pressure. The way does not abolish seriousness. It teaches another manner of bearing it.',
    why:
      'These books belong here because they teach orientation before system. They are concerned not only with what is true, but with how one stands, receives, moves, disciplines attention, and loosens the compulsion to control by force.',
    core: [
      {
        slug: 'daodejing',
        title: 'Daodejing',
        note: 'Dao De Jing: A Philosophical Translation; Making This Life Significant. By Roger T. Ames and David L. Hall.',
        href: 'https://a.co/d/0hcmF9uO',
        epithet: 'The Uncarved Block',
        quote: {
          text: 'The Way that can be spoken of is not the constant Way.',
          cite: 'Daodejing, ch. 1',
        },
        why: 'The root text of the Way—power through yielding, action through non-coercion. It teaches how to move with the grain of things rather than force the world into a shape it will not keep.',
        echoes: [
          { path: 'zion', slug: 'zhuangzi', title: 'The Complete Zhuangzi', note: 'The same Way at play—the holy fool who will not be carved into a useful shape.' },
          { path: 'de', slug: 'golden-flower', title: 'The Secret of the Golden Flower', note: 'Wu wei turned inward: letting the light circulate of itself rather than forcing it.' },
          { path: 'dao', slug: 'sermon-on-the-mount', title: 'The Sermon on the Mount', note: 'The lilies that toil not—provision without striving, in the Christian key.' },
        ],
      },
      {
        slug: 'shobogenzo',
        title: 'Shōbōgenzō',
        note: "Treasury of the True Dharma Eye: Zen Master Dogen's Shobo Genzo. Edited by Kazuaki Tanahashi.",
        href: 'https://a.co/d/00GRMEM6',
        epithet: 'Practice-Realization',
        quote: {
          text: 'To study the self is to forget the self.',
          cite: 'Dōgen, Genjōkōan',
        },
        why: 'Dōgen makes practice itself the teaching. The Way is not a doctrine to hold but a manner of sitting, walking, working, and seeing—realization inseparable from the act.',
        echoes: [
          { path: 'de', slug: 'on-having-no-head', title: 'On Having No Head', note: 'Realization you can check in the present act—forgetting the self, first-person.' },
          { path: 'dao', slug: 'gateless-gate', title: 'The Gateless Gate', note: 'The koan as practice that drops the seeker rather than informing him.' },
          { path: 'zion', slug: 'analects', title: 'The Analects of Confucius', note: 'The Way embodied in conduct and rite—the act itself as the teaching.' },
        ],
      },
      {
        slug: 'sermon-on-the-mount',
        title: 'The Sermon on the Mount',
        note: 'Matthew 5–7; and its Book of Mormon parallel, 3 Nephi 12–14.',
        href: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/12',
        epithet: 'Consider the Lilies',
        quote: {
          text: 'Consider the lilies of the field, how they grow; they toil not, neither do they spin.',
          cite: 'Matthew 6:28',
        },
        why: "The Way in the Latter-day Saint and Christian key: a discipline of non-grasping trust—provision without anxiety, righteousness without force.",
        echoes: [
          { path: 'dao', slug: 'daodejing', title: 'Daodejing', note: 'Wu wei: to act without forcing, as the lilies neither toil nor spin.' },
          { path: 'zion', slug: 'book-of-mormon', title: 'The Book of Mormon', note: 'The same trust made covenant: provision and deliverance through the Lord.' },
          { path: 'de', slug: 'the-prophet', title: 'The Prophet', note: 'The inner life of trust and surrender, spoken in image.' },
        ],
      },
    ],
    further: [
      {
        slug: 'three-zen-sutras',
        title: 'Three Zen Sutras',
        note: 'The Heart Sutra, The Diamond Sutra, and The Platform Sutra.',
        href: 'https://a.co/d/082KhE7o',
        epithet: 'Form Is Emptiness',
        quote: {
          text: 'Form is emptiness, emptiness is form.',
          cite: 'The Heart Sutra',
        },
        why: 'On emptiness and the groundlessness that frees. They dissolve the very footing the anxious self keeps trying to stand on.',
        echoes: [
          { path: 'dao', slug: 'gateless-gate', title: 'The Gateless Gate', note: 'Emptiness as the gate that was never barred.' },
          { path: 'de', slug: 'on-having-no-head', title: 'On Having No Head', note: 'No-self made first-person and checkable, not merely asserted.' },
          { path: 'dao', slug: 'daodejing', title: 'Daodejing', note: 'The usefulness of the empty—the hub, the vessel, the room.' },
        ],
      },
      {
        slug: 'gateless-gate',
        title: 'The Gateless Gate',
        note: 'All 48 koans, with commentary by Ekai, called Mumon.',
        href: 'https://a.co/d/0gmK8cVN',
        epithet: 'The Barrier With No Door',
        quote: {
          text: 'The Great Way has no gate; a thousand roads enter it.',
          cite: 'Mumon, preface',
        },
        why: 'Forty-eight koans that jam the discursive mind until it lets go. The gate is gateless because the Way was never barred—only mistaken for something to reason past.',
        echoes: [
          { path: 'dao', slug: 'three-zen-sutras', title: 'Three Zen Sutras', note: 'The emptiness the koan keeps pointing at.' },
          { path: 'dao', slug: 'shobogenzo', title: 'Shōbōgenzō', note: 'Practice as the dropping of the grasping mind.' },
          { path: 'de', slug: 'alan-watts', title: 'The Alan Watts Collection', note: 'The trap of the self-grasping thought, loosened in plain speech.' },
        ],
      },
      {
        slug: 'lieh-tzu',
        title: 'The Book of Lieh-tzu',
        note: 'A Taoist classic of spontaneity and ease. Translated by A.C. Graham (or Eva Wong).',
        href: '',
        epithet: 'The Way at Play',
        why: 'Taoist tales of ease, spontaneity, and the man who forgets himself. Where the Daodejing instructs, Lieh-tzu lets the Way be overheard in story.',
        echoes: [
          { path: 'dao', slug: 'daodejing', title: 'Daodejing', note: 'The Way instructed, here overheard in story.' },
          { path: 'zion', slug: 'zhuangzi', title: 'The Complete Zhuangzi', note: 'Kindred Taoist tale-telling—the wild ease and the laughing sage.' },
          { path: 'de', slug: 'the-prophet', title: 'The Prophet', note: 'Wisdom carried in parable and image rather than precept.' },
        ],
      },
    ],
  },

  de: {
    slug: 'de',
    name: 'De',
    subtitle: 'The Witness',
    glyph: '人',
    sancai: 'Human — virtue realized in a person',
    triadBlurb:
      'Texts of subjectivity, consciousness, interior disclosure, symbolic encounter, and first-person transformation.',
    lede:
      'This path concerns first-person life: lived experience before system, consciousness before role, and the disclosure of meaning where it is actually encountered rather than merely inherited.',
    statement:
      "Many come here after discovering that they can repeat a tradition's speech without ever having met its claims inwardly. The witness names the difficult movement from language alone into direct contact, interiority, symbol, and experience.",
    why:
      'These works belong here because they insist that insight must be encountered in the first person. They make room for consciousness, symbol, perception, and the inward labor by which a life becomes more truthful to itself.',
    core: [
      {
        slug: 'on-having-no-head',
        title: 'On Having No Head',
        note: 'Zen and the Rediscovery of the Obvious, by D.E. Harding.',
        href: 'https://a.co/d/0eKr6e89',
        why: "Harding's experiments turn the abstraction 'no-self' into something you can look and check for yourself, right now—witness before doctrine.",
      },
      {
        slug: 'science-of-the-first-person',
        title: 'The Science of the 1st Person',
        note: 'Its Principles, Practice, and Potential, by D.E. Harding.',
        href: 'https://a.co/d/0c8smFXv',
        why: "Harding's fuller method: attention turned around to face its own source. A rigorous, first-person empiricism of awareness.",
      },
      {
        slug: 'the-prophet',
        title: 'The Prophet',
        note: 'by Kahlil Gibran.',
        href: 'https://a.co/d/02GWyHXJ',
        why: 'Gibran speaks the inner life in images—love, work, grief, joy—meeting the reader where meaning is actually felt rather than argued.',
      },
      {
        slug: 'golden-flower',
        title: 'The Secret of the Golden Flower',
        note: 'From the TaiShang, Taoist lineage. Translations by Thomas Cleary or Xon Leighton.',
        href: '',
        why: 'A Taoist manual of inner light and the circulation of attention—the witness as a practice of turning the gaze inward until it shines.',
      },
    ],
    further: [
      {
        slug: 'alan-watts',
        title: 'The Alan Watts Collection',
        note: 'Available via the Waking Up app.',
        href: 'https://dynamic.wakingup.com/pack/PD974C',
        why: 'Watts is the great translator of Eastern interiority for the Western ear—loosening the knot of the separate self with wit and clarity.',
      },
      {
        slug: 'iron-john',
        title: 'Iron John',
        note: 'A Book About Men, by Robert Bly.',
        href: 'https://a.co/d/0j8uGUZM',
        why: "Bly reads a single fairy tale as the map of a man's inner initiation—symbol and story as instruments of first-person transformation.",
      },
    ],
  },

  zion: {
    slug: 'zion',
    name: 'Zion',
    subtitle: 'The Order',
    glyph: '地',
    sancai: 'Earth — the order built among a people',
    triadBlurb:
      'Texts of covenant, law, communal memory, ritual form, and the difficult labor of making a people.',
    lede:
      'This path concerns durable form: covenant, law, ritual, memory, and the difficult labor by which persons and peoples are gathered into a life that can be held, transmitted, and judged.',
    statement:
      'Many resist order after experiencing its anxious distortions. Yet no life remains human for long without form, memory, and shared obligation. Zion names the problem of order recovered rather than merely obeyed.',
    why:
      'These texts belong here because they are preoccupied with communal life: memory, law, ritual, transmission, hierarchy, covenant, and the formation of a people. They preserve the question of what order can be when it is not reduced to mere control.',
    core: [
      {
        slug: 'book-of-mormon',
        title: 'The Book of Mormon',
        note: 'The Earliest Text. Edited by Royal Skousen.',
        href: 'https://a.co/d/00X0qYd1',
        why: "A people's covenant record—rise, forgetting, and return. Zion as a thing to be built, lost, and rebuilt across generations.",
      },
      {
        slug: 'torah',
        title: 'The Torah',
        note: 'The foundational text of Judaism — the Pentateuch, first five books of the Hebrew Bible.',
        href: '',
        why: 'The founding law and narrative of a covenant people—how a wandering company becomes an order bound by memory and obligation.',
      },
      {
        slug: 'analects',
        title: 'The Analects of Confucius',
        note: 'A Philosophical Translation by Roger T. Ames and David L. Hall.',
        href: 'https://a.co/d/02DnWZJj',
        why: 'Order as cultivated relation: ritual, role, and reverence as the forms through which a humane society holds together.',
      },
      {
        slug: 'zhuangzi',
        title: 'The Complete Zhuangzi',
        note: 'The Complete Works of Zhuangzi. Translated by Burton Watson.',
        href: '',
        why: 'Why on the path of Order? Because every living order needs its holy fool. Zhuangzi is the wild counter-voice within Zion—the laughter that keeps law from hardening into mere rule, and reminds the city that its forms serve life, not the reverse.',
      },
    ],
    further: [
      {
        slug: 'pearl-of-great-price',
        title: 'Pearl of Great Price',
        note: 'by the Prophet Joseph Smith Jr.',
        href: 'https://a.co/d/074wnOxl',
        why: "Latter-day scripture of cosmogony and covenant—Enoch's Zion, the city taken up, as the archetype of an order made whole.",
      },
      {
        slug: 'jesus-the-christ',
        title: 'Jesus the Christ',
        note: 'by Elder James E. Talmage.',
        href: 'https://a.co/d/00DVBcfI',
        why: 'Talmage’s measured account of the life that, for the Latter-day Saint, founds the new covenant and the order built upon it.',
      },
      {
        slug: 'sri-chaitanya',
        title: 'Sri Chaitanya and His Associates',
        note: 'by Swami B.B. Tirtha Maharaja.',
        href: 'https://a.co/d/0jll3FCR',
        why: 'A devotional order formed around shared ecstatic practice—community as the vessel and discipline of love.',
      },
    ],
  },
}

export const pathOrder = ['dao', 'de', 'zion']
