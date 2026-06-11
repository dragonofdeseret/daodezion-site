// ──────────────────────────────────────────────────────────────────────────────
// The three paths of approach. Each path is a "mode" the Library is arranged by,
// mapped onto the 三才 (sancai): Heaven / Human / Earth.
//
// Consumed by src/pages/{dao,de,zion}.astro via the PathArticle component, and
// by src/pages/library.astro for the triad cards.
//
// Book `tier`: "core" → primary link style, "further" → secondary link style.
// Leave `href` empty ("") for a title with no link yet; it renders as plain text.
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
      },
      {
        title: 'Shōbōgenzō',
        note: "Treasury of the True Dharma Eye: Zen Master Dogen's Shobo Genzo. Edited by Kazuaki Tanahashi.",
        href: 'https://a.co/d/00GRMEM6',
      },
      {
        title: 'The Bhagavad Gita',
        note: 'Introduced and Translated by Eknath Easwaran.',
        href: 'https://a.co/d/0cu30pbG',
      },
    ],
    further: [
      {
        title: 'Three Zen Sutras',
        note: 'The Heart Sutra, The Diamond Sutra, and The Platform Sutra.',
        href: 'https://a.co/d/082KhE7o',
      },
      {
        title: 'The Gateless Gate',
        note: 'All 48 koans, with commentary by Ekai, called Mumon.',
        href: 'https://a.co/d/0gmK8cVN',
      },
      {
        title: 'The Dhammapada',
        note: 'Introduced and Translated by Eknath Easwaran.',
        href: 'https://a.co/d/07XUdcZD',
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
      },
      {
        title: 'The Science of the 1st Person',
        note: 'Its Principles, Practice, and Potential, by D.E. Harding.',
        href: 'https://a.co/d/0c8smFXv',
      },
      {
        title: 'The Prophet',
        note: 'by Kahlil Gibran.',
        href: 'https://a.co/d/02GWyHXJ',
      },
      {
        title: 'The Secret of the Golden Flower',
        note: 'From the TaiShang, Taoist lineage. Translations by Thomas Cleary or Xon Leighton.',
        href: '',
      },
    ],
    further: [
      {
        title: 'The Alan Watts Collection',
        note: 'Available via the Waking Up app.',
        href: 'https://dynamic.wakingup.com/pack/PD974C',
      },
      {
        title: 'The Red Book',
        note: 'by Carl G. Jung.',
        href: 'https://a.co/d/08BvOOMa',
      },
      {
        title: 'Man and His Symbols',
        note: 'by Carl G. Jung.',
        href: 'https://a.co/d/0et1mpXz',
      },
      {
        title: 'Iron John',
        note: 'A Book About Men, by Robert Bly.',
        href: 'https://a.co/d/0j8uGUZM',
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
      },
      {
        title: 'The Torah',
        note: 'The foundational text of Judaism — the Pentateuch, first five books of the Hebrew Bible.',
        href: '',
      },
      {
        title: 'The Analects of Confucius',
        note: 'A Philosophical Translation by Roger T. Ames and David L. Hall.',
        href: 'https://a.co/d/02DnWZJj',
      },
    ],
    further: [
      {
        title: 'Pearl of Great Price',
        note: 'by the Prophet Joseph Smith Jr.',
        href: 'https://a.co/d/074wnOxl',
      },
      {
        title: 'Jesus the Christ',
        note: 'by Elder James E. Talmage.',
        href: 'https://a.co/d/00DVBcfI',
      },
      {
        title: 'Sri Chaitanya and His Associates',
        note: 'by Swami B.B. Tirtha Maharaja.',
        href: 'https://a.co/d/0jll3FCR',
      },
    ],
  },
}

export const pathOrder = ['dao', 'de', 'zion']
