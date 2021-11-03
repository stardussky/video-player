import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoPlaybackRate from '@/components/VideoPlaybackRate/VideoPlaybackRate'
import './video-setting.scss'

const components = {
    playbackRate: VideoPlaybackRate,
}

const VideoSetting = ({ transformPlaybackRate, playbackRate, onPlaybackChange }) => {
    const displayEl = useRef(null)
    const contentEl = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [currentType, setCurrentType] = useState('playbackRate')
    const [defaultHeight, setDefaultHeight] = useState(0)
    const [maxHeight, setMaxHeight] = useState(0)

    const DynamicComponent = components[currentType]

    useEffect(() => {
        if (currentType) {
            setMaxHeight(contentEl.current.scrollHeight)
            return
        }
        setMaxHeight(displayEl.current.scrollHeight)
    }, [currentType])

    useEffect(() => {
        setDefaultHeight(displayEl.current.scrollHeight)
    }, [])

    return (
        <div className='video-setting'>
            <div className='video-media__controls-item video-setting__display'>
                <SvgIcon name='setting' />
            </div>
            <div
                className={classNames('video-setting__main', {
                    '-active': currentType,
                })}
                style={{
                    '--height': defaultHeight,
                    '--max-height': maxHeight,
                }}
            >
                <div>
                    <div className='video-setting__content' ref={displayEl}>
                        <ul>
                            <li className='video-setting__item' onClick={() => setCurrentType('playbackRate')}>
                                <div className='video-setting__item-option video-setting__item-display'>
                                    <p>播放速度</p>
                                    <p>{transformPlaybackRate}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='video-setting__content' ref={contentEl}>
                        {
                            currentType
                                ? <DynamicComponent onBack={(e) => setCurrentType(e)} transformPlaybackRate={transformPlaybackRate} playbackRate={playbackRate} onPlaybackChange={onPlaybackChange} />
                                : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

VideoSetting.propTypes = {
    transformPlaybackRate: PropTypes.string,
    playbackRate: PropTypes.number,
    onPlaybackChange: PropTypes.func,
}

export default VideoSetting
