import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

// Sample music data - in a real app this would come from an API or database
const sampleSongs = [
  {
    id: 1,
    title: "Ocean Dreams",
    artist: "Chill Vibes",
    duration: "3:45",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🌊",
    genre: "Electronic",
    year: 2023,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-15"
  },
  {
    id: 2,
    title: "Mountain High",
    artist: "Nature Sounds",
    duration: "4:12",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🏔️",
    genre: "Ambient",
    year: 2024,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-10"
  },
  {
    id: 3,
    title: "City Lights",
    artist: "Urban Beats",
    duration: "3:28",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🌃",
    genre: "Hip Hop",
    year: 2023,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-20"
  },
  {
    id: 4,
    title: "Sunset Boulevard",
    artist: "Jazz Ensemble",
    duration: "5:33",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🌅",
    genre: "Jazz",
    year: 2022,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-05"
  },
  {
    id: 5,
    title: "Digital Paradise",
    artist: "Cyber Dreams",
    duration: "4:01",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🤖",
    genre: "Electronic",
    year: 2024,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-25"
  },
  {
    id: 6,
    title: "Midnight Runner",
    artist: "Synthwave",
    duration: "3:56",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🌙",
    genre: "Synthwave",
    year: 2023,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-18"
  },
  {
    id: 7,
    title: "Crystal Waters",
    artist: "Aqua Beats",
    duration: "4:23",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "💎",
    genre: "Electronic",
    year: 2024,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-22"
  },
  {
    id: 8,
    title: "Neon City",
    artist: "Future Bass",
    duration: "3:37",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "🌆",
    genre: "Future Bass",
    year: 2023,
    playCount: 0,
    lastPlayed: null,
    dateAdded: "2024-01-12"
  }
]

// Default playlists
const defaultPlaylists = [
  {
    id: 'favorites',
    name: '❤️ Favorites',
    description: 'Your favorite songs',
    songs: [],
    cover: '❤️',
    isDefault: true,
    createdAt: Date.now()
  },
  {
    id: 'recently-added',
    name: '🆕 Recently Added',
    description: 'Recently added songs',
    songs: sampleSongs.slice(-4).map(s => s.id),
    cover: '🆕',
    isDefault: true,
    createdAt: Date.now()
  },
  {
    id: 'most-played',
    name: '🔥 Most Played',
    description: 'Your most played songs',
    songs: sampleSongs.slice(0, 3).map(s => s.id),
    cover: '🔥',
    isDefault: true,
    createdAt: Date.now()
  }
]

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'music-app-favorites',
  PLAYBACK_MODE: 'music-app-playback-mode',
  VOLUME: 'music-app-volume',
  SHUFFLE: 'music-app-shuffle',
  QUEUE: 'music-app-queue',
  RECENTLY_PLAYED: 'music-app-recently-played',
  SONGS_STATS: 'music-app-songs-stats',
  PLAYLISTS: 'music-app-playlists',
  THEME: 'music-app-theme',
  SLEEP_TIMER: 'music-app-sleep-timer',
  CROSSFADE: 'music-app-crossfade',
  VISUALIZER_STYLE: 'music-app-visualizer-style'
}

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])
  const [playbackMode, setPlaybackMode] = useState('normal') // normal, repeat, repeat-one
  const [isShuffled, setIsShuffled] = useState(false)
  const [currentView, setCurrentView] = useState('library') // library, favorites, queue, recent, playlists
  const [genreFilter, setGenreFilter] = useState('all')
  const [musicQueue, setMusicQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [songsStats, setSongsStats] = useState({})
  const [playlists, setPlaylists] = useState(defaultPlaylists)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [showVisualizer, setShowVisualizer] = useState(true)
  const [visualizerStyle, setVisualizerStyle] = useState('bars') // bars, wave, circle
  const [theme, setTheme] = useState('dark') // dark, light
  const [sleepTimer, setSleepTimer] = useState(null)
  const [crossfade, setCrossfade] = useState(0)
  const [audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [visualizerData, setVisualizerData] = useState([])
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const sleepTimerRef = useRef(null)

  // Initialize audio context for visualizer
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)()
        const analyserNode = context.createAnalyser()
        analyserNode.fftSize = 256
        setAudioContext(context)
        setAnalyser(analyserNode)
      } catch (error) {
        console.log('Audio context not supported')
      }
    }
    
    initAudioContext()
    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
    const savedMode = localStorage.getItem(STORAGE_KEYS.PLAYBACK_MODE)
    const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME)
    const savedShuffle = localStorage.getItem(STORAGE_KEYS.SHUFFLE)
    const savedQueue = localStorage.getItem(STORAGE_KEYS.QUEUE)
    const savedRecent = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED)
    const savedStats = localStorage.getItem(STORAGE_KEYS.SONGS_STATS)
    const savedPlaylists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS)
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    const savedVisualizerStyle = localStorage.getItem(STORAGE_KEYS.VISUALIZER_STYLE)
    const savedCrossfade = localStorage.getItem(STORAGE_KEYS.CROSSFADE)

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedMode) {
      setPlaybackMode(savedMode)
    }
    if (savedVolume) {
      const vol = parseFloat(savedVolume)
      setVolume(vol)
      if (audioRef.current) audioRef.current.volume = vol
    }
    if (savedShuffle) {
      setIsShuffled(JSON.parse(savedShuffle))
    }
    if (savedQueue) {
      const queue = JSON.parse(savedQueue)
      setMusicQueue(queue)
      if (queue.length > 0) {
        setQueueIndex(0)
        setCurrentSong(queue[0])
      }
    }
    if (savedRecent) {
      setRecentlyPlayed(JSON.parse(savedRecent))
    }
    if (savedStats) {
      setSongsStats(JSON.parse(savedStats))
    }
    if (savedPlaylists) {
      const userPlaylists = JSON.parse(savedPlaylists)
      setPlaylists(prev => [...defaultPlaylists, ...userPlaylists])
    }
    if (savedTheme) {
      setTheme(savedTheme)
    }
    if (savedVisualizerStyle) {
      setVisualizerStyle(savedVisualizerStyle)
    }
    if (savedCrossfade) {
      setCrossfade(parseInt(savedCrossfade))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYBACK_MODE, playbackMode)
  }, [playbackMode])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString())
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHUFFLE, JSON.stringify(isShuffled))
  }, [isShuffled])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(musicQueue))
  }, [musicQueue])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed))
  }, [recentlyPlayed])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SONGS_STATS, JSON.stringify(songsStats))
  }, [songsStats])

  useEffect(() => {
    const userPlaylists = playlists.filter(p => !p.isDefault)
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(userPlaylists))
  }, [playlists])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISUALIZER_STYLE, visualizerStyle)
  }, [visualizerStyle])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CROSSFADE, crossfade.toString())
  }, [crossfade])

  // Sleep timer effect
  useEffect(() => {
    if (sleepTimer && isPlaying) {
      sleepTimerRef.current = setTimeout(() => {
        setIsPlaying(false)
        if (audioRef.current) {
          audioRef.current.pause()
        }
        setSleepTimer(null)
        alert('Sleep timer ended. Music stopped.')
      }, sleepTimer * 60 * 1000)

      return () => {
        if (sleepTimerRef.current) {
          clearTimeout(sleepTimerRef.current)
        }
      }
    }
  }, [sleepTimer, isPlaying])

  // Update songs stats when playing
  useEffect(() => {
    if (currentSong && isPlaying) {
      const now = Date.now()
      setSongsStats(prev => ({
        ...prev,
        [currentSong.id]: {
          playCount: (prev[currentSong.id]?.playCount || 0) + 1,
          lastPlayed: now,
          totalPlayTime: (prev[currentSong.id]?.totalPlayTime || 0) + currentTime
        }
      }))

      // Add to recently played (max 20 items)
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(item => item.id !== currentSong.id)
        return [currentSong, ...filtered].slice(0, 20)
      })
    }
  }, [isPlaying, currentSong, currentTime])

  // Connect audio to analyser
  useEffect(() => {
    if (audioRef.current && audioContext && analyser) {
      try {
        const source = audioContext.createMediaElementSource(audioRef.current)
        source.connect(analyser)
        analyser.connect(audioContext.destination)
      } catch (error) {
        console.log('Audio source connection failed')
      }
    }
  }, [audioContext, analyser, currentSong])

  // Visualizer data update
  useEffect(() => {
    if (!analyser || !showVisualizer) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateVisualizer = () => {
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray)
        setVisualizerData(Array.from(dataArray.slice(0, visualizerStyle === 'circle' ? 32 : 16)))
        requestAnimationFrame(updateVisualizer)
      }
    }

    if (isPlaying) {
      updateVisualizer()
    }
  }, [analyser, isPlaying, showVisualizer, visualizerStyle])

  // Get unique genres
  const genres = ['all', ...new Set(sampleSongs.map(song => song.genre))]

  // Filter songs based on search, view, and genre
  const filteredSongs = useCallback(() => {
    let songs = currentView === 'favorites' 
      ? sampleSongs.filter(song => favorites.includes(song.id))
      : currentView === 'recent'
      ? recentlyPlayed
      : currentView === 'queue'
      ? musicQueue
      : currentView === 'playlists' && currentPlaylist
      ? sampleSongs.filter(song => currentPlaylist.songs.includes(song.id))
      : currentView === 'discover'
      ? [...sampleSongs].sort((a, b) => (songsStats[b.id]?.playCount || 0) - (songsStats[a.id]?.playCount || 0))
      : sampleSongs

    if (genreFilter !== 'all') {
      songs = songs.filter(song => song.genre === genreFilter)
    }

    return songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [currentView, favorites, recentlyPlayed, musicQueue, currentPlaylist, genreFilter, searchTerm, songsStats])

  useEffect(() => {
    const audio = audioRef.current
    
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => handleSongEnd()
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, playbackMode, isShuffled, musicQueue])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      switch(e.key) {
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(prev + 0.1, 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(prev - 0.1, 0))
          break
        case 's':
        case 'S':
          toggleShuffle()
          break
        case 'r':
        case 'R':
          cyclePlaybackMode()
          break
        case 'f':
        case 'F':
          toggleFavorite()
          break
        case 'q':
        case 'Q':
          setCurrentView('queue')
          break
        case 'p':
        case 'P':
          setCurrentView('playlists')
          break
        case 'd':
        case 'D':
          setCurrentView('discover')
          break
        case 't':
        case 'T':
          toggleTheme()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  })

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    
    if (audioContext?.state === 'suspended') {
      audioContext.resume()
    }
    
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const handleSongSelect = (song, index = null) => {
    setCurrentSong(song)
    setIsPlaying(false)
    setCurrentTime(0)
    
    if (currentView === 'queue' && index !== null) {
      setQueueIndex(index)
    }
  }

  const addToQueue = (song) => {
    setMusicQueue(prev => [...prev, song])
  }

  const removeFromQueue = (index) => {
    setMusicQueue(prev => prev.filter((_, i) => i !== index))
    if (index === queueIndex) {
      setQueueIndex(-1)
    } else if (index < queueIndex) {
      setQueueIndex(prev => prev - 1)
    }
  }

  const clearQueue = () => {
    setMusicQueue([])
    setQueueIndex(-1)
  }

  const playFromQueue = (index) => {
    if (musicQueue[index]) {
      setCurrentSong(musicQueue[index])
      setQueueIndex(index)
      setCurrentView('queue')
    }
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    
    const newTime = (e.target.value / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100
    setVolume(newVolume)
  }

  const getNextSong = () => {
    if (musicQueue.length > 0 && queueIndex >= 0) {
      // Use queue
      if (isShuffled) {
        const nextIndex = Math.floor(Math.random() * musicQueue.length)
        return { song: musicQueue[nextIndex], index: nextIndex }
      } else {
        const nextIndex = (queueIndex + 1) % musicQueue.length
        return { song: musicQueue[nextIndex], index: nextIndex }
      }
    } else {
      // Use main library
      if (!currentSong) return null
      
      let currentIndex = sampleSongs.findIndex(song => song.id === currentSong.id)
      let nextIndex

      if (isShuffled) {
        do {
          nextIndex = Math.floor(Math.random() * sampleSongs.length)
        } while (nextIndex === currentIndex && sampleSongs.length > 1)
      } else {
        nextIndex = (currentIndex + 1) % sampleSongs.length
      }
      
      return { song: sampleSongs[nextIndex], index: null }
    }
  }

  const getPreviousSong = () => {
    if (musicQueue.length > 0 && queueIndex >= 0) {
      // Use queue
      const prevIndex = queueIndex === 0 ? musicQueue.length - 1 : queueIndex - 1
      return { song: musicQueue[prevIndex], index: prevIndex }
    } else {
      // Use main library
      if (!currentSong) return null
      
      const currentIndex = sampleSongs.findIndex(song => song.id === currentSong.id)
      const previousIndex = currentIndex === 0 ? sampleSongs.length - 1 : currentIndex - 1
      return { song: sampleSongs[previousIndex], index: null }
    }
  }

  const handleNext = () => {
    const next = getNextSong()
    if (next && next.song) {
      setCurrentSong(next.song)
      if (next.index !== null) {
        setQueueIndex(next.index)
      }
    }
  }

  const handlePrevious = () => {
    const prev = getPreviousSong()
    if (prev && prev.song) {
      setCurrentSong(prev.song)
      if (prev.index !== null) {
        setQueueIndex(prev.index)
      }
    }
  }

  const handleSongEnd = () => {
    if (playbackMode === 'repeat-one') {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      const next = getNextSong()
      if (next && next.song) {
        setCurrentSong(next.song)
        if (next.index !== null) {
          setQueueIndex(next.index)
        }
      }
    }
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const cyclePlaybackMode = () => {
    const modes = ['normal', 'repeat', 'repeat-one']
    const currentIndex = modes.indexOf(playbackMode)
    setPlaybackMode(modes[(currentIndex + 1) % modes.length])
  }

  const toggleFavorite = () => {
    if (!currentSong) return
    
    setFavorites(prev => 
      prev.includes(currentSong.id)
        ? prev.filter(id => id !== currentSong.id)
        : [...prev, currentSong.id]
    )
  }

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDescription,
      songs: [],
      cover: '🎵',
      isDefault: false,
      createdAt: Date.now()
    }

    setPlaylists(prev => [...prev, newPlaylist])
    setNewPlaylistName('')
    setNewPlaylistDescription('')
    setShowCreatePlaylist(false)
  }

  const deletePlaylist = (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(null)
      }
    }
  }

  const addSongToPlaylist = (song, playlistId) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId && !playlist.songs.includes(song.id)
        ? { ...playlist, songs: [...playlist.songs, song.id] }
        : playlist
    ))
  }

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId
        ? { ...playlist, songs: playlist.songs.filter(id => id !== songId) }
        : playlist
    ))
  }

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * sampleSongs.length)
    setCurrentSong(sampleSongs[randomIndex])
    setCurrentView('library')
  }

  const setSleepTimerMinutes = (minutes) => {
    setSleepTimer(minutes)
  }

  const cancelSleepTimer = () => {
    setSleepTimer(null)
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current)
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatLastPlayed = (timestamp) => {
    if (!timestamp) return "Never"
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const formatDuration = (durationStr) => {
    const [minutes, seconds] = durationStr.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const getCurrentSongs = () => {
    const songs = filteredSongs()
    if (currentView === 'library' && isShuffled) {
      return [...songs].sort(() => Math.random() - 0.5)
    }
    return songs
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  const renderVisualizer = () => {
    if (!showVisualizer || visualizerData.length === 0) return null

    switch (visualizerStyle) {
      case 'wave':
        return (
          <div className="visualizer wave">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className="visualizer-bar"
                style={{
                  height: `${Math.max(value / 255 * 30, 2)}px`,
                  width: `${Math.max(value / 255 * 8, 2)}px`,
                  background: `linear-gradient(to top, 
                    hsl(${value * 1.4}, 70%, 60%), 
                    hsl(${value * 1.4}, 70%, 80%))`
                }}
              />
            ))}
          </div>
        )
      case 'circle':
        return (
          <div className="visualizer circle">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className="visualizer-circle"
                style={{
                  width: `${Math.max(value / 255 * 20 + 5, 8)}px`,
                  height: `${Math.max(value / 255 * 20 + 5, 8)}px`,
                  background: `hsl(${value * 1.4}, 70%, 60%)`,
                  opacity: value / 255
                }}
              />
            ))}
          </div>
        )
      default: // bars
        return (
          <div className="visualizer bars">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className="visualizer-bar"
                style={{
                  height: `${Math.max(value / 255 * 60, 4)}px`,
                  background: `linear-gradient(to top, 
                    hsl(${value * 1.4}, 70%, 60%), 
                    hsl(${value * 1.4}, 70%, 80%))`
                }}
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className="music-app">
      <audio ref={audioRef} src={currentSong?.src} />
      
      {/* Header */}
      <header className="app-header">
        <h1>🎵 Music Player</h1>
        
        <div className="header-controls">
          <div className="view-tabs">
            <button 
              className={`view-tab ${currentView === 'library' ? 'active' : ''}`}
              onClick={() => setCurrentView('library')}
            >
              📚 Library
            </button>
            <button 
              className={`view-tab ${currentView === 'favorites' ? 'active' : ''}`}
              onClick={() => setCurrentView('favorites')}
            >
              ❤️ Favorites ({favorites.length})
            </button>
            <button 
              className={`view-tab ${currentView === 'playlists' ? 'active' : ''}`}
              onClick={() => setCurrentView('playlists')}
            >
              🎵 Playlists ({playlists.filter(p => !p.isDefault).length})
            </button>
            <button 
              className={`view-tab ${currentView === 'queue' ? 'active' : ''}`}
              onClick={() => setCurrentView('queue')}
            >
              📋 Queue ({musicQueue.length})
            </button>
            <button 
              className={`view-tab ${currentView === 'recent' ? 'active' : ''}`}
              onClick={() => setCurrentView('recent')}
            >
              🕒 Recent ({recentlyPlayed.length})
            </button>
            <button 
              className={`view-tab ${currentView === 'discover' ? 'active' : ''}`}
              onClick={() => setCurrentView('discover')}
            >
              🔍 Discover
            </button>
          </div>

          <div className="search-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="header-actions">
              <button onClick={playRandomSong} className="random-btn" title="Play Random (D)">
                🎲 Random
              </button>
              <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme (T)">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Song Library */}
        <div className="song-library">
          <div className="library-header">
            <h2>
              {currentView === 'favorites' ? '❤️ Favorite Songs' : 
               currentView === 'queue' ? '📋 Music Queue' :
               currentView === 'recent' ? '🕒 Recently Played' :
               currentView === 'playlists' ? currentPlaylist ? currentPlaylist.name : '🎵 Playlists' :
               currentView === 'discover' ? '🔍 Discover Music' : '📚 Song Library'}
            </h2>
            
            <div className="library-actions">
              {currentView === 'library' && (
                <div className="genre-filter">
                  <select 
                    value={genreFilter} 
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="genre-select"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {currentView === 'playlists' && !currentPlaylist && (
                <button onClick={() => setShowCreatePlaylist(true)} className="create-playlist-btn">
                  ➕ New Playlist
                </button>
              )}
              
              {musicQueue.length > 0 && (
                <button onClick={() => setCurrentView('queue')} className="view-queue-btn">
                  View Queue
                </button>
              )}
              
              {currentPlaylist && (
                <button onClick={() => setCurrentPlaylist(null)} className="back-to-playlists-btn">
                  ← Back
                </button>
              )}
              
              {currentView === 'queue' && musicQueue.length > 0 && (
                <button onClick={clearQueue} className="clear-queue-btn">
                  Clear Queue
                </button>
              )}
            </div>
          </div>

          {/* Create Playlist Modal */}
          {showCreatePlaylist && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Create New Playlist</h3>
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="modal-input"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="modal-textarea"
                  rows="3"
                />
                <div className="modal-actions">
                  <button onClick={createPlaylist} className="create-btn">Create</button>
                  <button onClick={() => setShowCreatePlaylist(false)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Playlists View */}
          {currentView === 'playlists' && !currentPlaylist ? (
            <div className="playlists-grid">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`playlist-card ${currentPlaylist?.id === playlist.id ? 'active' : ''}`}
                  onClick={() => setCurrentPlaylist(playlist)}
                >
                  <div className="playlist-cover">{playlist.cover}</div>
                  <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.description}</p>
                    <span>{playlist.songs.length} songs</span>
                  </div>
                  {!playlist.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePlaylist(playlist.id)
                      }}
                      className="delete-playlist-btn"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="song-list">
              {getCurrentSongs().map((song, index) => (
                <div
                  key={song.id}
                  className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                  onClick={() => handleSongSelect(song, currentView === 'queue' ? index : null)}
                >
                  <div className="song-cover">{song.cover}</div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                    <div className="song-meta">
                      <span className="song-genre">{song.genre}</span>
                      <span className="song-year">{song.year}</span>
                      {songsStats[song.id] && (
                        <span className="song-plays">▶️ {songsStats[song.id].playCount || 0}</span>
                      )}
                      <span className="song-date-added">Added {song.dateAdded}</span>
                    </div>
                    {currentView === 'recent' && song.lastPlayed && (
                      <div className="song-last-played">
                        Last played: {formatLastPlayed(song.lastPlayed)}
                      </div>
                    )}
                  </div>
                  <div className="song-actions">
                    {currentView !== 'queue' && (
                      <button
                        className="queue-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToQueue(song)
                        }}
                        title="Add to Queue"
                      >
                        ➕
                      </button>
                    )}
                    <button
                      className={`favorite-btn ${favorites.includes(song.id) ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setFavorites(prev =>
                          prev.includes(song.id)
                            ? prev.filter(id => id !== song.id)
                            : [...prev, song.id]
                        )
                      }}
                    >
                      {favorites.includes(song.id) ? '❤️' : '🤍'}
                    </button>
                    <div className="song-duration">{song.duration}</div>
                  </div>
                </div>
              ))}
              
              {getCurrentSongs().length === 0 && (
                <div className="empty-state">
                  <p>No songs found</p>
                  {currentView === 'queue' && (
                    <button onClick={() => setCurrentView('library')} className="add-songs-btn">
                      Add songs from library
                    </button>
                  )}
                  {currentView === 'playlists' && currentPlaylist && (
                    <p>This playlist is empty. Add some songs!</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Now Playing */}
        <div className="now-playing">
          {currentSong ? (
            <>
              {/* Visualizer */}
              {renderVisualizer()}

              <div className="album-art">
                <div className="album-placeholder">
                  {currentSong.cover}
                </div>
              </div>
              <div className="song-details">
                <h2 className="current-song-title">{currentSong.title}</h2>
                <p className="current-song-artist">{currentSong.artist}</p>
                <div className="current-song-meta">
                  <span className="current-genre">{currentSong.genre}</span>
                  <span className="current-year">{currentSong.year}</span>
                  {songsStats[currentSong.id] && (
                    <span className="current-plays">▶️ {songsStats[currentSong.id].playCount || 0}</span>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="progress-container">
                <span className="time-display">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleSeek}
                  className="progress-bar"
                />
                <span className="time-display">{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="controls">
                <button 
                  onClick={toggleShuffle} 
                  className={`control-btn shuffle ${isShuffled ? 'active' : ''}`}
                  title="Shuffle (S)"
                >
                  🔀
                </button>
                <button onClick={handlePrevious} className="control-btn" title="Previous (←)">
                  ⏮️
                </button>
                <button onClick={togglePlayPause} className="control-btn play-pause" title="Play/Pause (Space)">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button onClick={handleNext} className="control-btn" title="Next (→)">
                  ⏭️
                </button>
                <button 
                  onClick={cyclePlaybackMode} 
                  className="control-btn repeat"
                  title={`Repeat Mode: ${playbackMode} (R)`}
                >
                  {playbackMode === 'repeat-one' ? '🔂' : playbackMode === 'repeat' ? '🔁' : '➡️'}
                </button>
              </div>

              {/* Additional Controls */}
              <div className="additional-controls">
                <button
                  onClick={toggleFavorite}
                  className={`favorite-toggle ${favorites.includes(currentSong.id) ? 'favorited' : ''}`}
                  title="Toggle Favorite (F)"
                >
                  {favorites.includes(currentSong.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
                
                <button
                  onClick={() => addToQueue(currentSong)}
                  className="queue-toggle"
                  title="Add to Queue"
                >
                  ➕ Add to Queue
                </button>
                
                <div className="control-row">
                  <button
                    onClick={() => setShowVisualizer(!showVisualizer)}
                    className={`visualizer-toggle ${showVisualizer ? 'active' : ''}`}
                    title="Toggle Visualizer"
                  >
                    📊 Visualizer
                  </button>
                  
                  <select
                    value={visualizerStyle}
                    onChange={(e) => setVisualizerStyle(e.target.value)}
                    className="visualizer-style-select"
                    title="Visualizer Style"
                  >
                    <option value="bars">Bars</option>
                    <option value="wave">Wave</option>
                    <option value="circle">Circle</option>
                  </select>
                </div>
              </div>

              {/* Sleep Timer */}
              <div className="sleep-timer">
                <div className="sleep-timer-header">
                  <span>😴 Sleep Timer</span>
                  {sleepTimer && (
                    <button onClick={cancelSleepTimer} className="cancel-sleep-timer-btn">
                      Cancel
                    </button>
                  )}
                </div>
                {sleepTimer ? (
                  <div className="sleep-timer-active">
                    <span>⏰ {sleepTimer} minutes remaining</span>
                  </div>
                ) : (
                  <div className="sleep-timer-options">
                    {[15, 30, 45, 60].map(minutes => (
                      <button
                        key={minutes}
                        onClick={() => setSleepTimerMinutes(minutes)}
                        className="sleep-timer-btn"
                      >
                        {minutes}m
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume */}
              <div className="volume-container">
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
                <span className="volume-display">{Math.round(volume * 100)}%</span>
              </div>

              {/* Crossfade */}
              <div className="crossfade-control">
                <label>
                  🔄 Crossfade: {crossfade}s
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={crossfade}
                  onChange={(e) => setCrossfade(parseInt(e.target.value))}
                  className="crossfade-slider"
                />
              </div>

              {/* Queue Info */}
              {musicQueue.length > 0 && (
                <div className="queue-info">
                  <div className="queue-status">
                    📋 Queue: {queueIndex + 1} / {musicQueue.length}
                  </div>
                  <button onClick={() => setCurrentView('queue')} className="view-full-queue-btn">
                    View Full Queue
                  </button>
                </div>
              )}

              {/* Statistics */}
              {songsStats[currentSong.id] && (
                <div className="song-stats">
                  <div className="stat-item">
                    <span>Play Count:</span>
                    <strong>{songsStats[currentSong.id].playCount || 0}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Last Played:</span>
                    <strong>{formatLastPlayed(songsStats[currentSong.id].lastPlayed)}</strong>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts Help */}
              <div className="keyboard-help">
                <details>
                  <summary>⌨️ Keyboard Shortcuts</summary>
                  <div className="shortcuts">
                    <div><kbd>Space</kbd> Play/Pause</div>
                    <div><kbd>←/→</kbd> Previous/Next</div>
                    <div><kbd>↑/↓</kbd> Volume Up/Down</div>
                    <div><kbd>S</kbd> Shuffle</div>
                    <div><kbd>R</kbd> Repeat Mode</div>
                    <div><kbd>F</kbd> Toggle Favorite</div>
                    <div><kbd>Q</kbd> View Queue</div>
                    <div><kbd>P</kbd> Playlists</div>
                    <div><kbd>D</kbd> Discover</div>
                    <div><kbd>T</kbd> Toggle Theme</div>
                  </div>
                </details>
              </div>
            </>
          ) : (
            <div className="no-song-selected">
              <p>Select a song to start playing</p>
              <div className="quick-actions">
                <button onClick={playRandomSong} className="quick-action-btn">
                  🎲 Play Random Song
                </button>
                <button onClick={() => setCurrentView('discover')} className="quick-action-btn">
                  🔍 Discover Music
                </button>
              </div>
              <div className="shortcuts-hint">
                <small>💡 Use keyboard shortcuts for better control!</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
