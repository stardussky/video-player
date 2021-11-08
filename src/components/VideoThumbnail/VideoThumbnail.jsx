import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './video-thumbnail.scss'

function VideoThumbnail ({ videoEl, currentTime }) {
    const [thumbnails, setThumbnails] = useState({})
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

            video.current.addEventListener('timeupdate', getThumbnail)
        }
    }

    const changeCurrentTime = (duration) => {
        if (!video.current || thumbnails[duration]) return

        video.current.currentTime = duration
    }
    const getThumbnail = () => {
        if (canvas.current && ctx.current) {
            ctx.current.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height)
            const image = canvas.current.toDataURL('image/webp', 0.2)
            setThumbnails((thumbnails) => ({ ...thumbnails, [video.current.currentTime]: image }))
        }
    }

    useEffect(() => {
        initVideo()
        return () => {
            video.current.removeEventListener('timeupdate', getThumbnail)
        }
    }, [])
    useEffect(() => {
        changeCurrentTime(currentTime)
    }, [currentTime])

    return (
        <div className='video-thumbnail' ref={thumbnailEl}>
            <div
                style={{
                    background: thumbnails[Math.ceil(currentTime)] ? `url(${thumbnails[Math.ceil(currentTime)]}) no-repeat center / cover` : '#111',
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
