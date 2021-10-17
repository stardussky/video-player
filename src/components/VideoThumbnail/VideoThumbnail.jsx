import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './video-thumbnail.scss'

function VideoThumbnail (props) {
    const [thumbnails, setThumbnails] = useState([])
    const thumbnailEl = useRef(null)

    const preLoadThumbnails = () => {
        let videoEl = document.querySelector(props.videoEl)
        if (videoEl && videoEl instanceof HTMLVideoElement) {
            videoEl = videoEl.cloneNode(true)

            videoEl.addEventListener('loadedmetadata', async () => {
                const { clientWidth, clientHeight } = thumbnailEl.current
                const canvas = document.createElement('canvas')
                canvas.width = clientWidth
                canvas.height = clientHeight
                const ctx = canvas.getContext('2d')

                const { duration } = videoEl

                for (let i = 0; i <= Math.ceil(duration); i++) {
                    videoEl.currentTime = i
                    await new Promise(resolve => {
                        videoEl.addEventListener('canplay', () => {
                            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
                            const image = canvas.toDataURL('image/jpeg')
                            setThumbnails((thumbnails) => [...thumbnails, image])
                            resolve(image)
                        }, { once: true })
                    })
                }
            })
        }
    }

    useEffect(() => {
        preLoadThumbnails()
    }, [])

    return (
        <div className='video-thumbnail' ref={thumbnailEl}>
            <div
                style={{
                    background: `#000 url(${thumbnails[Math.ceil(props.current)]}) no-repeat center / cover`,
                }}
            />
        </div>
    )
}

VideoThumbnail.propTypes = {
    videoEl: PropTypes.string,
    current: PropTypes.number,
}

export default VideoThumbnail
