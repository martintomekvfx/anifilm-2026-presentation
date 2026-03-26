import { useState, useEffect, useCallback } from 'react'
import './App.css'

const slides = [
  // 0 — Title
  () => (
    <div className="slide title-slide">
      <span className="tag">Anifilm 2026 · Liberec · 5.–10. května</span>
      <h1>Kolektivní<br />animace</h1>
    </div>
  ),

  // 1 — Context
  () => (
    <div className="slide">
      <span className="tag">Kontext</span>
      <h2>Navazujeme na AniJam 2025</h2>
      <div className="divider" />
      <p>
        Publikum Anifilmu: <strong>animátoři a lidé z animačního průmyslu</strong>.
        Cíl: vytvořit kolektivní dílo, které aktivuje festivalové publikum.
      </p>
      <div className="video-embed">
        <iframe
          src="https://www.youtube.com/embed/4_1Ed4Ys1UE"
          title="AniJam 2025"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  ),

  // 2 — Two concepts intro
  () => (
    <div className="slide section-slide">
      <span className="tag">Dva koncepty</span>
      <h1>A → B</h1>
      <p className="subtitle">Site-specific treasure hunt → Kolektivní digitální Dragonframe</p>
    </div>
  ),

  // 3 — Concept A: Title
  () => (
    <div className="slide section-slide">
      <span className="tag">Koncept A</span>
      <h1>Sbírač<br />framů</h1>
      <p className="subtitle">Site-specific · Liberec jako herní mapa</p>
    </div>
  ),

  // 4 — Concept A: Premise
  () => (
    <div className="slide">
      <span className="tag">Koncept A — Premisa</span>
      <h2>12 paste-upů = 12 framů</h2>
      <div className="big-number">12</div>
      <div className="divider" />
      <p>
        12 paste-upů rozmístěných na 12 festivalových místech v Liberci.
        Každý paste-up = jeden frame animace.
      </p>
      <p>
        Návštěvník chodí po městě, skenuje paste-upy přes <strong>web appku</strong>.
        Až posbírá všech 12, má svou osobní <strong>2-sekundovou animaci</strong> (6 fps).
      </p>
      <p>Tu submitne do <strong>kolektivní projekce</strong>.</p>
    </div>
  ),

  // 5 — Concept A: Mechanic
  () => (
    <div className="slide">
      <span className="tag">Koncept A — Mechanika</span>
      <h2>Jak to funguje</h2>
      <div className="divider" />
      <ol>
        <li>Najdeš paste-up → skenuj přes <strong>image recognition</strong> → získáš 1 frame</li>
        <li>Progress v appce: vidíš kolik framů máš <em>(3/12)</em>, ostatní jako nenalezené</li>
        <li>Po sesbírání všech 12 → appka sestaví <strong>2s animaci</strong> (6fps)</li>
        <li>Submitneš do kolektivního display</li>
        <li><strong>13. easter egg</strong> lokace mimo běžnou trasu = bonus frame</li>
      </ol>
    </div>
  ),

  // 6 — Concept A: Collective Display
  () => (
    <div className="slide">
      <span className="tag">Koncept A — Display</span>
      <h2>Guerilla CRT instalace</h2>
      <div className="divider" />
      <ul>
        <li>CRT monitor někde na festivalu — <strong>Raspberry Pi → composite out</strong></li>
        <li>Real-time display: shuffluje všechny submittnuté animace v loop</li>
        <li>Každý člověk = jeden <strong>2-sekundový clip</strong> za sebou</li>
        <li>Paste-up přímo vedle CRT = <strong>onboarding</strong> (vidíš TV, vidíš paste-up, pochopíš)</li>
        <li>QR kód u CRT pro stažení web appky</li>
      </ul>
    </div>
  ),

  // 7 — Concept A: Strengths
  () => (
    <div className="slide">
      <span className="tag">Koncept A — Proč</span>
      <h2>Silné stránky</h2>
      <div className="divider" />
      <div className="columns">
        <div className="col">
          <ul>
            <li>Nutí lidi <strong>chodit po městě</strong>, prozkoumávat Liberec</li>
            <li>CTF / treasure hunt mechanika <em>(ověřená z chompAR)</em></li>
            <li>Gamifikace, <strong>icebreaker</strong> pro neanimátory</li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <li><strong>Urbanistická intervence</strong> — město jako galerie</li>
            <li>Každý má svou vlastní <strong>unikátní animaci</strong></li>
            <li>Fyzický + digitální zážitek</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 9 — Concept A: Weaknesses + Open Questions
  () => (
    <div className="slide">
      <span className="tag">Koncept A — Rizika</span>
      <h2>Slabé stránky & otázky</h2>
      <div className="divider" />
      <ul>
        <li>Animační výstup je <strong>náhodný</strong>, ne záměrný (sbíráš, nekresíš)</li>
        <li>Vyžaduje fyzický pohyb — ne každý chce/může</li>
        <li>Komplexnější tech stack <em>(AR + backend + MP4 + CRT)</em></li>
        <li>Počasí / weatherproofing paste-upů</li>
        <li>WiFi dependency pro sync</li>
        <li>CRT runtime: non-stop celý festival? Kdo hlídá?</li>
      </ul>
    </div>
  ),

  // 10 — Section: Concept B
  () => (
    <div className="slide section-slide">
      <span className="tag">Koncept B</span>
      <h1>Kolektivní<br />Dragonframe</h1>
      <p className="subtitle">Festival-specific · Browser jako animační nástroj</p>
    </div>
  ),

  // 11 — Concept B: Premise
  () => (
    <div className="slide">
      <span className="tag">Koncept B — Premisa</span>
      <h2>Jeden společný film celého festivalu</h2>
      <div className="divider" />
      <p>
        Browser appka fungující jako <strong>mobilní Dragonframe</strong>.
        Účastníci přidávají framy do jedné společné animace.
      </p>
      <p>
        Každý vidí <strong>onion skin</strong> předchozího framu a navazuje na něj.
        Vzniká jedna velká <strong>kolektivní animace</strong>.
      </p>
      <p>
        <strong>Nulová bariéra vstupu:</strong> QR → browser → hotovo.
        Žádná instalace, žádný onboarding hell.
      </p>
    </div>
  ),

  // 12 — Concept B: Mechanic
  () => (
    <div className="slide">
      <span className="tag">Koncept B — Mechanika</span>
      <h2>Jak to funguje</h2>
      <div className="divider" />
      <ol>
        <li>Naskenuj <strong>QR kód</strong> na letáku (nebo přijdi k fixní stanici)</li>
        <li>Otevře se browser appka — <strong>nulová bariéra</strong></li>
        <li>Vidíš <strong>onion skin</strong> posledního framu</li>
        <li>Přidej vlastní frame: <strong>fotka nebo kresba</strong></li>
        <li>Frame se přidá do společné sekvence</li>
        <li>Můžeš přidat <strong>kolik framů chceš</strong></li>
      </ol>
    </div>
  ),

  // 13 — Concept B: Daily Topics
  () => (
    <div className="slide">
      <span className="tag">Koncept B — Dramaturgie</span>
      <h2>Daily topic</h2>
      <div className="divider" />
      <p>
        Každý festivalový den <strong>nové téma</strong> jako tvůrčí prompt.
        Dává strukturu výsledné animaci.
      </p>
      <p>
        Pomáhá lidem, co by jinak nevěděli co kreslit/fotit —
        <strong>prázdný canvas paralyzuje</strong>.
      </p>
      <div className="columns three">
        <div className="col">
          <h3>Den 1</h3>
          <p><em>metamorfóza</em></p>
        </div>
        <div className="col">
          <h3>Den 2</h3>
          <p><em>let</em></p>
        </div>
        <div className="col">
          <h3>Den 3</h3>
          <p><em>hora</em></p>
        </div>
      </div>
    </div>
  ),

  // 14 — Concept B: Distribution + Projection
  () => (
    <div className="slide">
      <span className="tag">Koncept B — Distribuce</span>
      <div className="columns">
        <div className="col">
          <h3>Jak se lidi dostanou k appce</h3>
          <ul>
            <li><strong>QR kódy na letácích</strong> — roznesené po festivalu</li>
            <li><strong>Fixní stanice</strong> — tablet u stánku/instalace</li>
            <li><strong>Osobní kontakt</strong> — ukážeš člověku appku na mobilu</li>
          </ul>
        </div>
        <div className="col">
          <h3>Výstupní projekce</h3>
          <ul>
            <li><strong>Živá projekce</strong> na festivalu</li>
            <li>Animace roste v <strong>reálném čase</strong></li>
            <li>Formát: chronologicky / po dnech / po tématech</li>
            <li>Lidi vidí výsledek <strong>v průběhu festivalu</strong></li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 13 — Concept B: Strengths
  () => (
    <div className="slide">
      <span className="tag">Koncept B — Proč</span>
      <h2>Silné stránky</h2>
      <div className="divider" />
      <div className="columns">
        <div className="col">
          <ul>
            <li><strong>Nulová bariéra</strong> vstupu</li>
            <li>Cílí na animátory — <strong>onion skin je jim přirozený</strong></li>
            <li>Vědomé navazování = <strong>vizuálně zajímavější</strong> výstup</li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <li>Daily topic = <strong>dramaturgie</strong></li>
            <li>Jednodušší tech, <strong>nižší riziko</strong></li>
            <li>Live projekce = <strong>okamžitý feedback</strong></li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 17 — Comparison
  () => (
    <div className="slide">
      <span className="tag">Srovnání</span>
      <h2>A vs B</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>A: Sbírač framů</th>
            <th>B: Kolektivní Dragonframe</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Typ</strong></td><td>Site-specific</td><td>Festival-specific</td></tr>
          <tr><td><strong>Aktivita</strong></td><td>Sbírání (treasure hunt)</td><td>Tvoření (animování)</td></tr>
          <tr><td><strong>Výstup</strong></td><td>Osobní animace</td><td>Jedna společná animace</td></tr>
          <tr><td><strong>Cílová skupina</strong></td><td>Kdokoliv</td><td>Primárně animátoři</td></tr>
          <tr><td><strong>Bariéra</strong></td><td>Střední (musíš chodit)</td><td>Nízká (QR → jsi v tom)</td></tr>
          <tr><td><strong>Tech</strong></td><td>Vysoká (AR + CRT)</td><td>Nízká (canvas + backend)</td></tr>
          <tr><td><strong>Urbanismus</strong></td><td>Silný</td><td>Slabý</td></tr>
        </tbody>
      </table>
    </div>
  ),

  // 18 — Decision
  () => (
    <div className="slide">
      <span className="tag">Rozhodnutí</span>
      <h2>Koncept B je vybraný</h2>
      <div className="divider" />
      <ul>
        <li>Anifilm = festival pro animátory → <strong>B cílí přesně na ně</strong></li>
        <li>Přímá evoluce AniJamu 2025 <em>(exquisite corpse → digitální kolaborace)</em></li>
        <li>Jednodušší implementace, <strong>nižší riziko</strong></li>
        <li>Daily topic dává <strong>dramaturgii</strong>, která A nemá</li>
        <li>Live projekce = <strong>silný payoff</strong></li>
      </ul>
      <div className="highlight-box">
        <p><strong>Koncept A se může realizovat nezávisle</strong> — paste-upy v Liberci jako standalone guerilla akce.</p>
      </div>
    </div>
  ),

  // 19 — Timeline
  () => (
    <div className="slide">
      <span className="tag">Časová osa</span>
      <h2>Timeline</h2>
      <div className="divider" />
      <table>
        <thead>
          <tr><th>Kdy</th><th>Co</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Březen 2026</strong></td><td>Brainstorm, rozhodnutí o konceptu ✓</td></tr>
          <tr><td><strong>Duben 2026</strong></td><td>Prototyp appky, test UX, daily topics</td></tr>
          <tr><td><strong>Konec dubna</strong></td><td>Submission pro Anifilm</td></tr>
          <tr><td><strong>3. května</strong></td><td>Příjezd do Liberce, příprava</td></tr>
          <tr><td><strong>5.–10. května</strong></td><td>Anifilm festival, live provoz</td></tr>
        </tbody>
      </table>
    </div>
  ),

  // 20 — References / End
  () => (
    <div className="slide title-slide">
      <span className="tag">Reference</span>
      <h1>Díky.</h1>
      <p>
        <a href="https://youtu.be/4_1Ed4Ys1UE" target="_blank" rel="noopener">AniJam 2025</a>
        {' · '}
        <a href="https://postptacek.github.io/chomps/" target="_blank" rel="noopener">ChompAR</a>
        {' · '}
        <a href="https://martintomekvfx.github.io/" target="_blank" rel="noopener">Portfolio</a>
        {' · '}
        <a href="https://github.com/Themolx" target="_blank" rel="noopener">GitHub</a>
      </p>
    </div>
  ),
]

function App() {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const go = useCallback((dir) => {
    setCurrent((prev) => {
      const next = prev + dir
      if (next < 0) return 0
      if (next >= total) return total - 1
      return next
    })
  }, [total])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0

    const onTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        go(dx < 0 ? 1 : -1)
      }
    }

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [go])

  const progress = ((current + 1) / total) * 100

  return (
    <div className="presentation" onClick={(e) => {
      if (e.target.closest('a')) return
      const x = e.clientX / window.innerWidth
      go(x < 0.33 ? -1 : 1)
    }}>
      {slides.map((SlideContent, i) => (
        <div key={i} className={`slide-wrapper${i === current ? ' active' : ''}`}>
          <SlideContent />
        </div>
      ))}

      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="slide-counter">{current + 1} / {total}</div>
    </div>
  )
}

export default App
