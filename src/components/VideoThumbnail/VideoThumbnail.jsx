import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './video-thumbnail.scss'

function VideoThumbnail ({ videoEl, currentTime }) {
    const [video, setVideo] = useState(null)
    const [thumbnails, setThumbnails] = useState(new Map())
    const thumbnailEl = useRef(null)

    const initVideo = () => {
        let el = document.querySelector(videoEl)
        if (el && el instanceof HTMLVideoElement) {
            el = el.cloneNode(true)
            el.crossOrigin = 'anonymous'
            setVideo(el)
        }
    }

    const getThumbnail = (duration) => {
        if (!video || thumbnails.has(duration)) return
        const { clientWidth, clientHeight } = thumbnailEl.current
        const canvas = document.createElement('canvas')
        canvas.width = clientWidth
        canvas.height = clientHeight
        const ctx = canvas.getContext('2d')

        video.currentTime = duration
        video.addEventListener('canplay', () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const image = canvas.toDataURL('image/webp')
            thumbnails.set(duration, image)
            setThumbnails((thumbnails) => new Map([...thumbnails]))
        }, { once: true })
    }

    useEffect(() => {
        initVideo()
    }, [])
    useEffect(() => {
        getThumbnail(currentTime)
    }, [currentTime])

    return (
        <div className='video-thumbnail' ref={thumbnailEl}>
            <div
                style={{
                    background: `#111 url(${thumbnails.get(Math.ceil(currentTime))}) no-repeat center / cover`,
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
