import React, { useState, useMemo } from 'react'
import './index.scss'
import VideoMedia from '@/components/VideoMedia/VideoMedia'

function Index () {
    const [sources, setSources] = useState([
        new URL('../../assets/video/video1.mp4', import.meta.url).href,
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ])
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0)

    const currentSource = useMemo(() => sources[currentSourceIndex % sources.length], [sources, currentSourceIndex])

    const handleChangeNextVideo = () => {
        setCurrentSourceIndex((currentSourceIndex + 1) % sources.length)
    }

    return (
        <div className='page-index'>
            <div className='container'>
                <VideoMedia
                    source={currentSource}
                    onChangeNextVideo={handleChangeNextVideo}
                />
            </div>
        </div>
    )
}

export default Index
