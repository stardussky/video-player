import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import './video-thumbnail.scss'

function VideoThumbnail ({ videoEl, currentTime }) {
    const [thumbnails, setThumbnails] = useState({})
    const [preloadThumbnails, setPreloadThumbnails] = useState({})
    const thumbnailEl = useRef(null)
    const video = useRef(null)
    const canvas = useRef(null)
    const ctx = useRef(null)

    const initVideo = () => {
        let el = document.querySelector(videoEl)
        if (el && el instanceof HTMLVideoElement) {
            el = el.cloneNode(true)
            el.crossOrigin = 'anonymous'
            video.current = el

            const { clientWidth, clientHeight } = thumbnailEl.current
            canvas.current = document.createElement('canvas')
            canvas.current.width = clientWidth
            canvas.current.height = clientHeight
            ctx.current = canvas.current.getContext('2d')

            video.current.addEventListener('timeupdate', handleTimeupdate)

            const preloadEl = el.cloneNode(true)
            preloadEl.addEventListener('loadedmetadata', async () => {
                const { duration } = preloadEl

                for (let i = 0; i <= Math.ceil(duration); i++) {
                    preloadEl.currentTime = i
                    await new Promise(resolve => {
                        preloadEl.addEventListener('canplay', () => {
                            const image = getThumbnail(preloadEl, 0)
                            setPreloadThumbnails((thumbnails) => ({ ...thumbnails, [i]: image }))
                            resolve(image)
                        }, { once: true })
                    })
                }
            }, { once: true })
        }
    }

    const changeCurrentTime = (duration) => {
        if (!video.current || thumbnails[duration]) return

        video.current.currentTime = duration
    }
    const handleTimeupdate = () => {
        const image = getThumbnail(video.current, 1)
        if (image) {
            setThumbnails((thumbnails) => ({ ...thumbnails, [video.current.currentTime]: image }))
        }
    }
    const getThumbnail = (video, encoder = 1) => {
        if (video instanceof HTMLVideoElement && canvas.current && ctx.current) {
            ctx.current.drawImage(video, 0, 0, canvas.current.width, canvas.current.height)
            return canvas.current.toDataURL('image/webp', encoder)
        }
    }

    useEffect(() => {
        initVideo()
        return () => {
            video.current.removeEventListener('timeupdate', handleTimeupdate)
        }
    }, [])
    useEffect(() => {
        changeCurrentTime(currentTime)
    }, [currentTime])

    const image = useMemo(() => {
        const t = Math.ceil(currentTime)
        return thumbnails[t] || preloadThumbnails[t]
    }, [currentTime, thumbnails])

    return (
        <div className='video-thumbnail' ref={thumbnailEl}>
            <div
                style={{
                    background: image ? `url(${image}) no-repeat center / cover` : '#111',
                }}
            />
        </div>
    )
}

VideoThumbnail.propTypes = {
    videoEl: PropTypes.string,
    currentTime: PropTypes.number,
}

export default VideoThumbnail
