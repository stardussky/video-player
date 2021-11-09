import React, { useState, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import './index.scss'
import VideoMedia from '@/components/VideoMedia/VideoMedia'

function Index () {
    const { search } = useLocation()
    const history = useHistory()
    const [sources, setSources] = useState([
        {
            name: '【月球隕落】HD中文正式電影預告',
            source: new URL('../../assets/video/video1.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img1.jpg', import.meta.url).href,
        },
        {
            name: '【梅艷芳Anita】正式預告',
            source: new URL('../../assets/video/video2.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img2.jpg', import.meta.url).href,
        },
        {
            name: '【蜘蛛人：無家日】最新4K前導電影預告',
            source: new URL('../../assets/video/video3.mp4', import.meta.url).href,
            thumbnail: new URL('../../assets/img/img3.jpg', import.meta.url).href,
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
