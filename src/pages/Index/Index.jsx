import React, { useState, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import './index.scss'
import VideoMedia from '@/components/VideoMedia/VideoMedia'

function Index () {
    const { search } = useLocation()
    const history = useHistory()
    const [sources, setSources] = useState([
        {
            name: 'video1',
            source: new URL('../../assets/video/video1.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img1.png', import.meta.url).href,
        },
        {
            name: 'video2',
            source: new URL('../../assets/video/video2.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img2.png', import.meta.url).href,
        },
        {
            name: 'video3',
            source: new URL('../../assets/video/video3.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img3.png', import.meta.url).href,
        },
    ])
    const routeQuery = useMemo(() => new URLSearchParams(search, [search]))
    const currentSourceIndex = useMemo(() => sources.findIndex(({ name }) => name === (routeQuery.get('watch') || 'video1')))
    const source = useMemo(() => sources[currentSourceIndex], [sources, currentSourceIndex])
    const nextSource = useMemo(() => sources[(currentSourceIndex + 1) % sources.length], [sources, currentSourceIndex])

    const handleChangeNextVideo = () => {
        history.push({ search: `?watch=${nextSource.name}` })
    }

    return (
        <div className='page-index'>
            <div className='container'>
                <VideoMedia
                    source={source}
                    nextSource={nextSource}
                    onChangeNextVideo={handleChangeNextVideo}
                />
            </div>
        </div>
    )
}

export default Index
