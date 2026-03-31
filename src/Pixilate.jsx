import { useState, useEffect, useRef, useCallback } from 'react'
import { getFrameUrl, listFrames, uploadFrame } from './supabase'
import './pixilate.css'

const SESSION = 'anifilm-2026'

export default function Pixilate() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [framePaths, setFramePaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [capturing, setCapturing] = useState(false)
  const [onionOpacity, setOnionOpacity] = useState(0.3)
  const [showPlayback, setShowPlayback] = useState(false)
  const [playbackIdx, setPlaybackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [flash, setFlash] = useState(false)
  const streamRef = useRef(null)

  // Load existing frames
  const loadFrames = useCallback(async () => {
    const paths = await listFrames(SESSION)
    setFramePaths(paths)
    setLoading(false)
  }, [])

  // Start camera
  useEffect(() => {
    let mounted = true
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        })
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          videoRef.current.onloadeddata = () => setCameraReady(true)
        } else {
          stream.getTracks().forEach(t => t.stop())
        }
      } catch (err) {
        console.error('Camera error:', err)
        setStatus('Camera error - check permissions')
      }
    }
    startCamera()

    return () => {
      mounted = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Initial frame load
  useEffect(() => {
    loadFrames()
  }, [loadFrames])

  // Poll for new frames every 5s
  useEffect(() => {
    const interval = setInterval(loadFrames, 5000)
    return () => clearInterval(interval)
  }, [loadFrames])

  // Draw onion skin
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || framePaths.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const onionPaths = framePaths.slice(-3)
    const images = []
    let loaded = 0

    onionPaths.forEach((path, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        loaded++
        images[i] = img
        if (loaded === onionPaths.length) {
          drawOnion(ctx, canvas, images, onionOpacity)
        }
      }
      img.onerror = () => {
        loaded++
        if (loaded === onionPaths.length) {
          drawOnion(ctx, canvas, images.filter(Boolean), onionOpacity)
        }
      }
      img.src = getFrameUrl(path)
    })
  }, [framePaths, onionOpacity])

  function drawOnion(ctx, canvas, images, opacity) {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    images.forEach((img, i) => {
      const layerOpacity = opacity * ((i + 1) / images.length)

      const off = document.createElement('canvas')
      off.width = canvas.width
      off.height = canvas.height
      const offCtx = off.getContext('2d')

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (canvas.width - w) / 2
      const y = (canvas.height - h) / 2

      offCtx.drawImage(img, x, y, w, h)

      offCtx.globalCompositeOperation = 'multiply'
      offCtx.fillStyle = '#44ff88'
      offCtx.fillRect(0, 0, off.width, off.height)
      offCtx.globalCompositeOperation = 'source-over'

      ctx.globalAlpha = layerOpacity
      ctx.drawImage(off, 0, 0)
    })
    ctx.globalAlpha = 1
  }

  // Capture frame
  async function captureFrame() {
    const video = videoRef.current
    if (!video || capturing) return

    if (!cameraReady || video.videoWidth === 0 || video.videoHeight === 0) {
      setStatus('Camera not ready yet...')
      setTimeout(() => setStatus(''), 2000)
      return
    }

    setCapturing(true)
    setStatus('Capturing...')

    try {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = video.videoWidth
      tempCanvas.height = video.videoHeight
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')
      ctx.drawImage(video, 0, 0)

      const blob = await new Promise((resolve) => {
        tempCanvas.toBlob(b => resolve(b), 'image/jpeg', 0.85)
      })

      if (!blob) throw new Error('Failed to create image blob')

      setFlash(true)
      setTimeout(() => setFlash(false), 150)

      setStatus('Uploading...')
      const path = await uploadFrame(SESSION, blob)

      if (path) {
        await loadFrames()
        setStatus('Frame saved!')
      } else {
        setStatus('Upload failed!')
      }
    } catch (err) {
      console.error('Capture error:', err)
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setCapturing(false)
      setTimeout(() => setStatus(''), 2000)
    }
  }

  // Guard playbackIdx
  useEffect(() => {
    if (playbackIdx >= framePaths.length && framePaths.length > 0) {
      setPlaybackIdx(framePaths.length - 1)
    }
  }, [framePaths.length, playbackIdx])

  // Playback
  useEffect(() => {
    if (!playing || !showPlayback || framePaths.length === 0) return
    const len = framePaths.length
    const interval = setInterval(() => {
      setPlaybackIdx(prev => {
        const next = prev + 1
        if (next >= len) {
          setPlaying(false)
          return 0
        }
        return next
      })
    }, 150)
    return () => clearInterval(interval)
  }, [playing, showPlayback, framePaths.length])

  if (loading) {
    return <div className="pix-loading">Loading...</div>
  }

  if (showPlayback && framePaths.length > 0) {
    return (
      <div className="pix-playback-overlay">
        <img
          src={getFrameUrl(framePaths[playbackIdx])}
          alt={`Frame ${playbackIdx + 1}`}
          crossOrigin="anonymous"
        />
        <div className="pix-playback-controls">
          <button onClick={() => {
            if (playing) { setPlaying(false) } else { setPlaybackIdx(0); setPlaying(true) }
          }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <span>{playbackIdx + 1} / {framePaths.length}</span>
          <button onClick={() => { setPlaying(false); setShowPlayback(false) }}>
            ✕ Close
          </button>
        </div>
        <div className="pix-timeline">
          {framePaths.map((p, i) => (
            <img
              key={p}
              src={getFrameUrl(p)}
              className={`pix-timeline-thumb ${i === playbackIdx ? 'current' : ''}`}
              onClick={() => { setPlaying(false); setPlaybackIdx(i) }}
              crossOrigin="anonymous"
              alt=""
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pix-app">
      <div className="pix-header">
        <span className="pix-tag">Anifilm 2026</span>
        <h1>PIXILATE</h1>
        <p>Collaborative stop-motion animation</p>
      </div>

      <div className="pix-viewport">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} className="pix-onion-layer" />

        {flash && <div style={{position:'absolute',inset:0,background:'#fff',zIndex:10,pointerEvents:'none'}} />}

        <div className="pix-frame-count">
          {framePaths.length} frames
          {status && <div style={{marginTop:4,color:'#ff0'}}>{status}</div>}
          {!cameraReady && <div style={{marginTop:4,color:'#f80'}}>Starting camera...</div>}
        </div>

        <div className="pix-onion-control">
          <span>Onion: {Math.round(onionOpacity * 100)}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={onionOpacity * 100}
            onChange={e => setOnionOpacity(Number(e.target.value) / 100)}
          />
        </div>
      </div>

      <div className="pix-controls">
        <button
          className="pix-side-btn"
          onClick={() => { setPlaybackIdx(0); setShowPlayback(true) }}
          disabled={framePaths.length === 0}
          title="Play"
        >
          ▶
        </button>
        <button
          className="pix-capture-btn"
          onClick={captureFrame}
          disabled={capturing}
          title="Capture"
        />
        <div className="pix-side-btn" style={{visibility:'hidden'}} />
      </div>

      {framePaths.length > 0 && (
        <div className="pix-timeline">
          {framePaths.slice(-30).map((p, _i) => {
            const realIdx = framePaths.length - 30 + _i
            const idx = realIdx < 0 ? _i : realIdx
            return (
              <img
                key={p}
                src={getFrameUrl(p)}
                className={`pix-timeline-thumb ${idx === framePaths.length - 1 ? 'current' : ''}`}
                crossOrigin="anonymous"
                alt=""
                loading="lazy"
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
