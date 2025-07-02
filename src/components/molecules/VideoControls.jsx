import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IconButton from '@/components/atoms/IconButton'
import ApperIcon from '@/components/ApperIcon'

const VideoControls = ({ 
  isPlaying, 
  onPlayPause, 
  currentTime, 
  duration, 
  onSeek, 
  volume, 
  onVolumeChange,
  onFullscreen,
  className = '' 
}) => {
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [tempTime, setTempTime] = useState(currentTime)
  const controlsTimeoutRef = useRef(null)
  const volumeTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isDragging) {
      setTempTime(currentTime)
    }
  }, [currentTime, isDragging])

  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    if (showControls) {
      resetControlsTimeout()
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value)
    setTempTime(value)
    if (!isDragging) {
      onSeek(value)
    }
  }

  const handleProgressMouseDown = () => {
    setIsDragging(true)
  }

  const handleProgressMouseUp = () => {
    setIsDragging(false)
    onSeek(tempTime)
  }

  const handleVolumeMouseEnter = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    setShowVolumeSlider(true)
  }

  const handleVolumeMouseLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false)
    }, 300)
  }

  const progressPercentage = duration > 0 ? (tempTime / duration) * 100 : 0

  return (
    <div 
      className={`absolute inset-0 ${className}`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          >
            {/* Main Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={tempTime}
                    onChange={handleProgressChange}
                    onMouseDown={handleProgressMouseDown}
                    onMouseUp={handleProgressMouseUp}
                    className="progress-bar w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FF0000 0%, #FF0000 ${progressPercentage}%, rgba(255,255,255,0.3) ${progressPercentage}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white mt-1">
                    <span>{formatTime(tempTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconButton
                    icon={isPlaying ? 'Pause' : 'Play'}
                    variant="glass"
                    size="large"
                    onClick={onPlayPause}
                  />

                  <div
                    className="relative"
                    onMouseEnter={handleVolumeMouseEnter}
                    onMouseLeave={handleVolumeMouseLeave}
                  >
                    <IconButton
                      icon={volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'}
                      variant="glass"
                      onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)}
                    />

                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 rounded-lg p-2"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="volume-slider h-20 w-4 bg-white/30 rounded-full appearance-none cursor-pointer"
                            style={{
                              writingMode: 'bt-lr',
                              WebkitAppearance: 'slider-vertical',
                              background: `linear-gradient(to top, #FFFFFF 0%, #FFFFFF ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <IconButton
                    icon="Settings"
                    variant="glass"
                  />
                  <IconButton
                    icon="Maximize"
                    variant="glass"
                    onClick={onFullscreen}
                  />
                </div>
              </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <IconButton
                  icon="Play"
                  variant="glass"
                  size="large"
                  onClick={onPlayPause}
                  className="w-20 h-20 bg-black/50 hover:bg-black/70"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoControls