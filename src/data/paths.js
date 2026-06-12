// ──────────────────────────────────────────────────────────────────────────────
// The three paths of approach. Each path is a "mode" the Library is arranged by,
// mapped onto the 三才 (sancai): Heaven / Human / Earth.
//
// Consumed by src/pages/{dao,de,zion}.astro via the PathArticle component, and
// by src/pages/library.astro for the triad cards.
//
// Each book:
//   title  — display name
//   note   — edition / translator line
//   href   — purchase or read link; leave "" for a title with no link (plain text)
//   why    — one or two sentences on why this text sits in this section (optional;
//            renders as an expandable "Why it belongs" under the entry)
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
        title: 'Daodejing',
        note: 'Dao De Jing: A Philosophical Translation; Making This Life Significant. By Roger T. Ames and David L. Hall.',
        href: 'https://a.co/d/0hcmF9uO',
        why: 'The root text of the Way—power through yielding, action through non-coercion. It teaches how to move with the grain of things rather than force the world into a shape it will not keep.',
      },
      {
        title: 'Shōbōgenzō',
        note: "Treasury of the True Dharma Eye: Zen Master Dogen's Shobo Genzo. Edited by Kazuaki Tanahashi.",
        href: 'https://a.co/d/00GRMEM6',
        why: 'Dōgen makes practice itself the teaching. The Way is not a doctrine to hold but a manner of sitting, walking, working, and seeing—realization inseparable from the act.',
      },
      {
        title: 'The Sermon on the Mount',
        note: 'Matthew 5–7; and its Book of Mormon parallel, 3 Nephi 12–14.',
        href: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/12',
        why: "The Way in the Latter-day Saint and Christian key: 'Consider the lilies… they toil not.' A discipline of non-grasping trust—provision without anxiety, righteousness without force.",
      },
    ],
    further: [
      {
        title: 'Three Zen Sutras',
        note: 'The Heart Sutra, The Diamond Sutra, and The Platform Sutra.',
        href: 'https://a.co/d/082KhE7o',
        why: 'On emptiness and the groundlessness that frees. They dissolve the very footing the anxious self keeps trying to stand on.',
      },
      {
        title: 'The Gateless Gate',
        note: 'All 48 koans, with commentary by Ekai, called Mumon.',
        href: 'https://a.co/d/0gmK8cVN',
        why: 'Forty-eight koans that jam the discursive mind until it lets go. The gate is gateless because the Way was never barred—only mistaken for something to reason past.',
      },
      {
        title: 'The Book of Lieh-tzu',
        note: 'A Taoist classic of spontaneity and ease. Translated by A.C. Graham (or Eva Wong).',
        href: '',
        why: 'Taoist tales of ease, spontaneity, and the man who forgets himself. Where the Daodejing instructs, Lieh-tzu lets the Way be overheard in story.',
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
        title: 'On Having No Head',
        note: 'Zen and the Rediscovery of the Obvious, by D.E. Harding.',
        href: 'https://a.co/d/0eKr6e89',
        why: "Harding's experiments turn the abstraction 'no-self' into something you can look and check for yourself, right now—witness before doctrine.",
      },
      {
        title: 'The Science of the 1st Person',
        note: 'Its Principles, Practice, and Potential, by D.E. Harding.',
        href: 'https://a.co/d/0c8smFXv',
        why: "Harding's fuller method: attention turned around to face its own source. A rigorous, first-person empiricism of awareness.",
      },
      {
        title: 'The Prophet',
        note: 'by Kahlil Gibran.',
        href: 'https://a.co/d/02GWyHXJ',
        why: 'Gibran speaks the inner life in images—love, work, grief, joy—meeting the reader where meaning is actually felt rather than argued.',
      },
      {
        title: 'The Secret of the Golden Flower',
        note: 'From the TaiShang, Taoist lineage. Translations by Thomas Cleary or Xon Leighton.',
        href: '',
        why: 'A Taoist manual of inner light and the circulation of attention—the witness as a practice of turning the gaze inward until it shines.',
      },
    ],
    further: [
      {
        title: 'The Alan Watts Collection',
        note: 'Available via the Waking Up app.',
        href: 'https://dynamic.wakingup.com/pack/PD974C',
        why: 'Watts is the great translator of Eastern interiority for the Western ear—loosening the knot of the separate self with wit and clarity.',
      },
      {
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
        title: 'The Book of Mormon',
        note: 'The Earliest Text. Edited by Royal Skousen.',
        href: 'https://a.co/d/00X0qYd1',
        why: "A people's covenant record—rise, forgetting, and return. Zion as a thing to be built, lost, and rebuilt across generations.",
      },
      {
        title: 'The Torah',
        note: 'The foundational text of Judaism — the Pentateuch, first five books of the Hebrew Bible.',
        href: '',
        why: 'The founding law and narrative of a covenant people—how a wandering company becomes an order bound by memory and obligation.',
      },
      {
        title: 'The Analects of Confucius',
        note: 'A Philosophical Translation by Roger T. Ames and David L. Hall.',
        href: 'https://a.co/d/02DnWZJj',
        why: 'Order as cultivated relation: ritual, role, and reverence as the forms through which a humane society holds together.',
      },
      {
        title: 'The Complete Zhuangzi',
        note: 'The Complete Works of Zhuangzi. Translated by Burton Watson.',
        href: '',
        why: 'Why on the path of Order? Because every living order needs its holy fool. Zhuangzi is the wild counter-voice within Zion—the laughter that keeps law from hardening into mere rule, and reminds the city that its forms serve life, not the reverse.',
      },
    ],
    further: [
      {
        title: 'Pearl of Great Price',
        note: 'by the Prophet Joseph Smith Jr.',
        href: 'https://a.co/d/074wnOxl',
        why: "Latter-day scripture of cosmogony and covenant—Enoch's Zion, the city taken up, as the archetype of an order made whole.",
      },
      {
        title: 'Jesus the Christ',
        note: 'by Elder James E. Talmage.',
        href: 'https://a.co/d/00DVBcfI',
        why: 'Talmage’s measured account of the life that, for the Latter-day Saint, founds the new covenant and the order built upon it.',
      },
      {
        title: 'Sri Chaitanya and His Associates',
        note: 'by Swami B.B. Tirtha Maharaja.',
        href: 'https://a.co/d/0jll3FCR',
        why: 'A devotional order formed around shared ecstatic practice—community as the vessel and discipline of love.',
      },
    ],
  },
}

export const pathOrder = ['dao', 'de', 'zion']
