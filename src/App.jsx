import { useState, useEffect, useCallback } from 'react'
import Pixilate from './Pixilate'
import './App.css'

const PIXILATE_URL = `${window.location.origin}/anifilm-2026-presentation/pixilate`
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(PIXILATE_URL)}&bgcolor=0a0a0a&color=ffffff`

const slides = [
  // 0 — Title
  () => (
    <div className="slide title-slide">
      <span className="tag">Anifilm 2026 · Liberec · 5.–10. května</span>
      <h1>Kolektivní<br />animace</h1>
    </div>
  ),

  // 1 — AniJam 2025
  () => (
    <div className="slide">
      <span className="tag">AniJam 2025</span>
      <h2>Navazujeme na AniJam 2025</h2>
      <div className="divider" />
      <p>
        Loňský ročník: <strong>exquisite corpse</strong> formát,
        kolektivní analogová animace přímo na festivalu.
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

  // 2 — Concept B: Title
  () => (
    <div className="slide section-slide">
      <span className="tag">Koncept</span>
      <h1>Kolektivní<br />Dragonframe</h1>
      <p className="subtitle">Browser jako animační nástroj</p>
    </div>
  ),

  // 3 — Concept B: Premise
  () => (
    <div className="slide">
      <span className="tag">Premisa</span>
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
      
      </p>
    </div>
  ),

  // 4 — Concept B: Mechanic
  () => (
    <div className="slide">
      <span className="tag">Mechanika</span>
      <h2>Jak to funguje</h2>
      <div className="divider" />
      <ol>
        <li>Naskenuj <strong>QR kód</strong> na letáku</li>
        <li>Otevře se browser appka</li>
        <li>Vidíš <strong>onboarding</strong> a předchozích pár framů</li>
        <li>Přidej vlastních X framů a <strong>navaž na animaci!</strong></li>
        <li>Vidíme <strong>výsledek</strong></li>
      </ol>
    </div>
  ),

  // 5 — Concept B: Daily Topics
  () => (
    <div className="slide">
      <span className="tag">Dramaturgie</span>
      <h2>Daily topic</h2>
      <div className="divider" />
      <p>
        Každý festivalový den <strong>nové téma</strong>.
      </p>
      <div className="columns three">
        <div className="col">
          <h3><em>Den 1</em></h3>
          <p><strong>žízeň</strong></p>
        </div>
        <div className="col">
          <h3><em>Den 2</em></h3>
          <p><strong>let</strong></p>
        </div>
        <div className="col">
          <h3><em>Den 3</em></h3>
          <p><strong>hora</strong></p>
        </div>
      </div>
    </div>
  ),

  // 6 — Concept B: Distribution + Projection
  () => (
    <div className="slide">
      <span className="tag">Distribuce</span>
      <div className="columns">
        <div className="col">
          <h3>Jak se lidi dostanou k appce</h3>
          <ul>
            <li><strong>QR kódy na letácích</strong>, roznesené po festivalu</li>
            <li><strong>Osobní kontakt</strong>, ukážeš člověku appku na mobilu</li>
          </ul>
        </div>
        <div className="col">
          <h3>Výstup</h3>
          <ul>
            <li>Animace roste v <strong>reálném čase</strong></li>
            <li>Formát: chronologicky</li>
            <li><strong>Finální projekce</strong> v baru <strong>Papír</strong></li>
          </ul>
        </div>
      </div>
      <div className="divider" />
      <p>Vizuální styl aplikace: <strong>kreslená animace</strong></p>
    </div>
  ),

  // 7 — Prototype: Pixilate
  () => (
    <div className="slide">
      <span className="tag">Prototyp</span>
      <h2>Vyzkoušej si to</h2>
      <div className="divider" />
      <div className="qr-section">
        <div className="qr-code">
          <img src={QR_IMG} alt="QR kód na Pixilate" width="220" height="220" />
        </div>
        <div className="qr-info">
          <p>
            Funkční prototyp kolektivní stop-motion appky.
            Otevři na <strong>mobilu</strong> a zkus přidat frame.
          </p>
          <p>
            <strong><a href={PIXILATE_URL} target="_blank" rel="noopener">Manualní odkaz</a></strong>
          </p>
        </div>
      </div>
      <div className="divider" />
      <div className="contact-info">
        <p><strong>Martin Tomek</strong><br />martintomek.vfx@gmail.com<br />+774630132</p>
        <p><strong>Michal Tancjura</strong><br />michal.tancjura@gmail.com</p>
      </div>
    </div>
  ),
]

function App() {
  const isPixilate = window.location.pathname.replace(/\/$/, '').endsWith('/pixilate')

  if (isPixilate) return <Pixilate />

  return <Presentation />
}

function Presentation() {
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
