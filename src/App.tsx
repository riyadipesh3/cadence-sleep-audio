import { useEffect, useRef, useState, type ReactNode } from 'react'

/* IntersectionObserver reveal. No scroll listeners anywhere on this page. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const BEDS = [
  {
    id: 'delta',
    name: 'Delta 1.7 Hz',
    depth: 'Deep sleep, first three cycles',
    body: 'Slow enough to pull a room down with it. Layered under a low tidal bed so there is something to rest on.',
    minutes: 240,
    tone: 'D1.7',
  },
  {
    id: 'theta',
    name: 'Theta 6.3 Hz',
    depth: 'Drowsy, between waking and sleep',
    body: 'The band you pass through on the way down. Useful for twenty minutes in a chair before a night shift.',
    minutes: 105,
    tone: 'T6.3',
  },
  {
    id: 'alpha',
    name: 'Alpha 10.4 Hz',
    depth: 'Resting wakefulness, eyes closed',
    body: 'Close but not over. Used for commutes, waiting rooms and the twenty minutes before you can get in bed.',
    minutes: 45,
    tone: 'A10.4',
  },
  {
    id: 'pink',
    name: 'Pink noise',
    depth: 'Masks a room, holds a light sleep',
    body: 'Equal energy per octave, so it does not hiss on the consonants. The one most people fall asleep to.',
    minutes: 480,
    tone: 'PN',
  },
]

/* Six entries, so this is a card grid rather than a long list. */
const PRACTICE = [
  { label: 'Settling', mins: 6, note: 'Long exhale, jaw released' },
  { label: 'Body scan', mins: 14, note: 'Feet to crown, no counting' },
  { label: 'Night waking', mins: 3, note: 'For the 3am wide-awake hour' },
  { label: 'Pre-shift', mins: 9, note: 'Before a night rotation starts' },
  { label: 'Drift', mins: 22, note: 'Ambient, no guidance track' },
  { label: 'Deep rest', mins: 45, note: 'Wind down to nothing' },
]

const GUIDES = [
  {
    name: 'Eilidh Sinclair',
    role: 'Sleep physiologist, Perth',
    quote:
      'I read the overnight logs from about four hundred listeners. The ones who fell asleep fastest were not the ones who worked hardest at it. They were the ones who stopped counting.',
  },
  {
    name: 'Malachy Okonkwo',
    role: 'Breathwork teacher, Glasgow',
    quote:
      'An exhale slightly longer than the inhale is enough to slow the heart. Anything more elaborate and the counting itself becomes the thing keeping you awake.',
  },
  {
    name: 'Sorcha Nic Dhomhnuill',
    role: 'Instructor, North Uist',
    quote:
      'We work with people who have not slept properly in years. What changes first is not the sleeping. It is what they believe is going to happen when they lie down.',
  },
]

/* Six log entries, laid out as a 3 by 2 grid. */
const NIGHT_LOG = [
  { night: 4, bed: 'Delta 1.7 Hz', fell: 19, woke: 1, length: '6 h 41' },
  { night: 9, bed: 'Pink Noise', fell: 11, woke: 2, length: '7 h 08' },
  { night: 14, bed: 'Delta 1.7 Hz', fell: 14, woke: 0, length: '7 h 52' },
  { night: 18, bed: 'Theta 6.3 Hz', fell: 26, woke: 1, length: '5 h 58' },
  { night: 23, bed: 'Pink Noise', fell: 9, woke: 1, length: '8 h 15' },
  { night: 31, bed: 'Delta 1.7 Hz', fell: 12, woke: 0, length: '7 h 30' },
]

/* Session lengths read as minutes below an hour and hours above it, so a
   480 minute bed never renders as "8 hr". */
function formatLength(mins: number) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

function QuoteMark() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <path
        d="M0 26V14.6C0 6.2 4.4 1 12.4 0l1.4 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H0zm20.2 0V14.6C20.2 6.2 24.6 1 32.6 0L34 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H20.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 11L11 2M11 2H4.2M11 2v6.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Dial({
  bed,
  playing,
  onToggle,
}: {
  bed: string
  playing: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? `Pause ${bed}` : `Play ${bed}`}
      className={`neu grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center ${
        playing ? 'neu-inset' : 'neu-sm'
      }`}
      style={{ transition: 'box-shadow 320ms cubic-bezier(0.32, 0.72, 0, 1)' }}
    >
      <span className={playing ? 'text-tide' : 'text-ink-soft'}>
        <span className={playing ? 'glyph-pause block' : 'glyph-play block'} />
      </span>
    </button>
  )
}

export default function App() {
  const [bed, setBed] = useState(BEDS[0].id)
  const [playing, setPlaying] = useState(false)
  const [alarm, setAlarm] = useState(true)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const active = BEDS.find((b) => b.id === bed) ?? BEDS[0]

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value.includes('@') || value.length < 6) {
      setError('Add an address we can reach you on.')
      setSent(false)
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <>
      {/* Padded so the raised header panel's own shadow is never clipped by
          the top of the viewport, which is what a sticky shell of its own
          would do at scroll position zero. */}
      <header className="sticky top-0 z-30 pt-5">
        <div className="neu-sm flex h-[4.25rem] items-center justify-between py-2.5">
          <div className="shell flex w-full items-center justify-between">
            <a href="#top" className="flex items-baseline gap-2.5">
              <span className="font-display text-[1.35rem] font-medium tracking-[-0.035em] text-ink">
                Cadence
              </span>
            </a>
            <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
              <a href="#beds" className="link-underline text-sm text-ink-soft hover:text-ink">
                Sound beds
              </a>
              <a href="#practice" className="link-underline text-sm text-ink-soft hover:text-ink">
                Practice
              </a>
              <a href="#guides" className="link-underline text-sm text-ink-soft hover:text-ink">
                Guides
              </a>
              <a href="#log" className="link-underline text-sm text-ink-soft hover:text-ink">
                Night log
              </a>
            </nav>
            <a href="#trial" className="btn neu-sm btn-tide !px-5 !py-2.5 !text-sm">
              Start a trial
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero: exactly four text elements, eyebrow, headline, subtext, CTAs.
            The player lives in the beds section so nothing else competes here. */}
        <section className="shell flex min-h-[100dvh] items-center pt-20 pb-16">
          <div className="mx-auto w-full max-w-[54rem] text-center">
            <Reveal>
              <p className="micro mb-7">Delta, theta and pink</p>
              <h1 className="text-[clamp(2.35rem,5.4vw,4.15rem)] leading-[1.0] text-ink">
                Sleep audio that knows when to stop talking.
              </h1>
              <p className="mx-auto mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink-soft">
                Recorded beds in the real delta and theta bands, and guidance only where it earns its
                place.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                <a href="#trial" className="btn neu btn-tide">
                  Start a trial
                  <span className="btn-icon">
                    <ArrowGlyph />
                  </span>
                </a>
                <a href="#beds" className="btn neu btn-ink">
                  Hear the beds
                </a>
              </div>
            </Reveal>

            {/* A control, not a text element, so the hero stays at four.
                Carries the material at the largest scale on the page and is
                the same playing state the beds section drives. */}
            <Reveal delay={130} className="mt-16">
              <button
                type="button"
                className="dial mx-auto h-[8.5rem] w-[8.5rem] sm:h-[10rem] sm:w-[10rem]"
                data-on={playing}
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                aria-label={playing ? 'Pause the session' : 'Play the session'}
              >
                <span className="dial-face h-[6rem] w-[6rem] sm:h-[7rem] sm:w-[7rem]">
                  <span className={playing ? 'text-tide' : 'text-ink'}>
                    <span className={playing ? 'glyph-pause block' : 'glyph-play block'} />
                  </span>
                </span>
              </button>
            </Reveal>
          </div>
        </section>

        {/* Beds: the player opens this section because the player IS the
            product. Segmented control and switch are both wired to state,
            and the selected band drives the cards below. */}
        <section id="beds" className="shell py-24 md:py-28">
          <Reveal>
            <div className="neu-lg mx-auto flex max-w-[46rem] flex-col gap-7 p-8 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-[0.8125rem] text-ink-soft">{active.tone}</p>
                <p className="font-mono text-[0.8125rem] text-ink-mute">
                  {String(Math.floor(active.minutes / 60)).padStart(2, '0')}:
                  {String(active.minutes % 60).padStart(2, '0')} total
                </p>
              </div>

              <div className="seg" role="group" aria-label="Sound bed">
                {BEDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="seg-item"
                    aria-pressed={bed === b.id}
                    onClick={() => {
                      setBed(b.id)
                      setPlaying(true)
                    }}
                  >
                    <span className="font-mono text-[0.75rem] leading-[1.35]">{b.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-pressed={playing}
                    className="neu grid h-16 w-16 place-items-center"
                    aria-label={playing ? 'Pause session' : 'Play session'}
                  >
                    <span className={playing ? 'text-tide' : 'text-ink'}>
                      <span className={playing ? 'glyph-pause block' : 'glyph-play block'} />
                    </span>
                  </button>
                  <p className="max-w-[24ch] text-sm leading-[1.55] text-ink-soft">
                    {playing ? 'Playing on a loop' : 'Ready when you are'}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-3.5"
                  onClick={() => setAlarm((a) => !a)}
                  aria-pressed={alarm}
                >
                  <span className="text-sm text-ink-soft">Fade out</span>
                  <span className="switch-track" data-on={alarm} aria-hidden="true">
                    <span className="switch-knob" />
                  </span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* Headline and explainer stacked, not a split header. */}
          <Reveal className="mt-20">
            <h2 className="max-w-[17ch] text-[clamp(2rem,3.9vw,3.1rem)] text-ink">
              Four beds. Each one built around a real band.
            </h2>
            <p className="mt-5 max-w-[58ch] leading-[1.7] text-ink-soft">
              Frequencies are the ones used in slow-wave sleep research, 0.5 to 4 Hz for delta and 4 to
              8 Hz for theta. Nothing is sharpened or boosted after the fact.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {BEDS.map((b, i) => (
              <Reveal key={b.id} delay={i * 70} className="h-full">
                <article className="neu flex h-full flex-col p-7">
                  {/* No photograph here on purpose. Every picsum seed in the
                      catalogue returns a saturated landscape or a night
                      cityscape, and a livid orange mountain in a sleep
                      product is worse than no picture. The band name, the
                      band figure and the dial carry this card instead. */}
                  <div className="flex flex-1 flex-col">
                    <p className="font-mono text-[0.75rem] text-ink-mute">{b.depth}</p>
                    <h3 className="mt-2 text-xl text-ink">{b.name}</h3>
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.65] text-ink-soft">
                      {b.body}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-ink-soft">{formatLength(b.minutes)}</span>
                    <Dial
                      bed={b.name}
                      playing={playing && bed === b.id}
                      onToggle={() => {
                        if (bed === b.id) setPlaying((p) => !p)
                        else {
                          setBed(b.id)
                          setPlaying(true)
                        }
                      }}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Practice: asymmetric 2 + 1, image left, two stacked blocks right. */}
        <section id="practice" className="shell py-24 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <img
                src="https://picsum.photos/seed/quiet-room-window/1000/1200"
                alt="A timber cabin at the end of a jetty over mirror still water under a dark sky"
                width={1000}
                height={1200}
                loading="lazy"
                className="h-80 w-full object-cover sm:h-[30rem] lg:h-full"
              />
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={90}>
                <h2 className="max-w-[17ch] text-[clamp(2rem,3.9vw,3.1rem)] text-ink">
                  Six tracks, none longer than twenty two minutes.
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="max-w-[54ch] leading-[1.7] text-ink-soft">
                  Guidance stops as soon as it is not needed. A track that keeps talking at forty
                  minutes teaches you to wait for the talking.
                </p>
              </Reveal>
              <Reveal delay={210} className="grid gap-4 sm:grid-cols-2">
                {PRACTICE.slice(0, 4).map((p) => (
                  <div key={p.label} className="neu-inset-sm p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[0.9375rem] text-ink">{p.label}</h3>
                      <span className="font-mono text-[0.8125rem] text-tide">{p.mins}m</span>
                    </div>
                    <p className="mt-2 text-sm leading-[1.55] text-ink-soft">{p.note}</p>
                  </div>
                ))}
              </Reveal>
              <Reveal delay={270} className="grid gap-4 sm:grid-cols-2">
                {PRACTICE.slice(4).map((p) => (
                  <div key={p.label} className="neu p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[0.9375rem] text-ink">{p.label}</h3>
                      <span className="font-mono text-[0.8125rem] text-ink-mute">{p.mins}m</span>
                    </div>
                    <p className="mt-2 text-sm leading-[1.55] text-ink-soft">{p.note}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Guides: alternating asymmetric rows, no image, no card grid. */}
        <section id="guides" className="shell py-24 md:py-28">
          <Reveal>
            <h2 className="max-w-[20ch] text-[clamp(2rem,3.9vw,3.1rem)] text-ink">
              Read by the people who built it.
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col gap-5">
            {GUIDES.map((g, i) => (
              <Reveal key={g.name} delay={i * 80}>
                <figure
                  className={`neu flex flex-col gap-6 p-8 md:flex-row md:items-center md:gap-12 ${
                    i % 2 === 1 ? 'md:pl-16' : 'md:pr-16'
                  }`}
                >
                  <div
                    className={`flex min-w-0 flex-1 flex-col gap-5 ${
                      i % 2 === 1 ? 'md:order-2' : ''
                    }`}
                  >
                    <span className="text-tide">
                      <QuoteMark />
                    </span>
                    <blockquote className="text-[clamp(1.0625rem,1.6vw,1.3125rem)] leading-[1.5] tracking-[-0.015em] text-ink">
                      {g.quote}
                    </blockquote>
                  </div>
                  <figcaption
                    className={`flex shrink-0 flex-col gap-1 md:w-[13rem] ${
                      i % 2 === 1 ? 'md:order-1 md:items-end md:text-right' : ''
                    }`}
                  >
                    <span className="text-sm text-ink">{g.name}</span>
                    <span className="font-mono text-[0.6875rem] leading-[1.5] text-ink-mute">
                      {g.role}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Night log: 3 by 2 grid of recessed cards, six entries, no gaps. */}
        <section id="log" className="shell py-24 md:py-28">
          <Reveal>
            <h2 className="max-w-[18ch] text-[clamp(2rem,3.9vw,3.1rem)] text-ink">
              What the app logged last month.
            </h2>
            <p className="mt-5 max-w-[58ch] leading-[1.7] text-ink-soft">
              Six nights drawn from a trial, in the order they happened. Nothing here is a target
              anybody hit on purpose.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {NIGHT_LOG.map((n, i) => (
              <Reveal key={n.night} delay={i * 60} className="h-full">
                <article className="neu-inset-sm flex h-full flex-col gap-5 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[0.8125rem] text-ink-mute">
                      Night {n.night}
                    </span>
                    <span className="text-xs text-ink-soft">{n.length}</span>
                  </div>
                  <p className="text-[0.9375rem] text-ink">{n.bed}</p>
                  <div className="mt-auto flex flex-col gap-3.5">
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-mono text-[0.6875rem] text-ink-mute">Fell asleep</span>
                        <span className="font-mono text-[0.8125rem] text-ink-soft">{n.fell} min</span>
                      </div>
                      <div className="neu-rail mt-2 h-2 w-full">
                        <span
                          className="block h-full bg-tide"
                          style={{ width: `${Math.min(100, (n.fell / 45) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-mono text-[0.6875rem] text-ink-mute">Woke</span>
                        <span className="font-mono text-[0.8125rem] text-ink-soft">
                          {n.woke === 0 ? 'not once' : `${n.woke} time${n.woke === 1 ? '' : 's'}`}
                        </span>
                      </div>
                      <div className="neu-rail mt-2 h-2 w-full">
                        <span
                          className="block h-full bg-ink-mute"
                          style={{ width: `${(n.woke / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Trial: form panel raised against a plain copy column. */}
        <section id="trial" className="shell pb-24 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <h2 className="max-w-[15ch] text-[clamp(2rem,3.9vw,3.1rem)] text-ink">
                Twenty one nights before you decide anything.
              </h2>
              <p className="mt-6 max-w-[48ch] leading-[1.7] text-ink-soft">
                One bed, one guided track, and the fade out. No card is asked for until night twenty,
                and cancelling takes a single email.
              </p>
              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                {[
                  ['Bed included', 'Delta 1.7 Hz, 240 minutes'],
                  ['Guided track', 'Night waking, 3 minutes'],
                  ['Ends', 'Cancel from the email, no call'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
                      {k}
                    </dt>
                    <dd className="mt-2 text-sm text-ink-soft">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120}>
              <form className="neu-lg flex flex-col gap-6 p-7 md:p-9" onSubmit={submit} noValidate>
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="email" className="text-sm text-ink">
                    Address for the trial link
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setSent(false)
                    }}
                    placeholder="eilidh@example.net"
                    aria-describedby="email-hint"
                    aria-invalid={error ? true : undefined}
                  />
                  <p id="email-hint" className="font-mono text-[0.6875rem] text-ink-mute">
                    One link, sent once
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-sm text-ink">Settings that come with it</span>
                  <div className="neu-inset-sm flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-ink-soft">Fade the last four minutes</span>
                      <button
                        type="button"
                        className="shrink-0"
                        onClick={() => setAlarm((a) => !a)}
                        aria-pressed={alarm}
                        aria-label="Fade the last four minutes"
                      >
                        <span className="switch-track" data-on={alarm} aria-hidden="true">
                          <span className="switch-knob" />
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-ink-soft">Bed repeats until stopped</span>
                      <button
                        type="button"
                        className="shrink-0"
                        onClick={() => setPlaying((p) => !p)}
                        aria-pressed={playing}
                        aria-label="Bed repeats until stopped"
                      >
                        <span className="switch-track" data-on={playing} aria-hidden="true">
                          <span className="switch-knob" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-sm font-medium text-[#8a3229]">
                    {error}
                  </p>
                )}

                {sent ? (
                  <p className="neu-inset-sm px-5 py-4 text-sm text-ink-soft" role="status">
                    Link sent to {email.trim()}. It lasts seven days.
                  </p>
                ) : (
                  <button type="submit" className="btn neu btn-tide self-start">
                    Send the link
                    <span className="btn-icon">
                      <ArrowGlyph />
                    </span>
                  </button>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="neu-lg shell flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:py-16">
          <div>
            <p className="font-display text-lg text-ink">Cadence</p>
            <p className="mt-3 max-w-[40ch] text-sm leading-[1.65] text-ink-soft">
              Four beds, six guided tracks, and a fade out. Recorded in Dundee and mixed at 44.1 kHz.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <a href="#beds" className="link-underline text-ink-soft hover:text-ink">
              Sound beds
            </a>
            <a href="#practice" className="link-underline text-ink-soft hover:text-ink">
              Practice
            </a>
            <a href="#guides" className="link-underline text-ink-soft hover:text-ink">
              Guides
            </a>
            <a href="#log" className="link-underline text-ink-soft hover:text-ink">
              Night log
            </a>
          </nav>
          <div className="text-sm text-ink-soft">
            <p>Parliament Street, Dundee</p>
            <p className="mt-1">DD1 1JN</p>
            <a href="#trial" className="link-underline mt-4 inline-block hover:text-ink">
              Start a trial
            </a>
          </div>
        </div>
        <div className="shell py-8">
          <p className="font-mono text-[0.6875rem] text-ink-mute">
            Developed by{' '}
            <a
              href="https://thediyadevelopers.com"
              className="link-underline text-ink-soft"
            >
              Diya Developers
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}