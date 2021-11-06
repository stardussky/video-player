import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoPlaybackRate from '@/components/VideoPlaybackRate/VideoPlaybackRate'
import blur from '@/functions/blur'
import './video-setting.scss'

const components = {
    playbackRate: VideoPlaybackRate,
}

const VideoSetting = ({ transformPlaybackRate, playbackRate, onChangePlaybackRate, onChangeSettingStatus }) => {
    // TODO icon 提示
    const videoSettingEl = useRef(null)
    const displayContentEl = useRef(null)
    const contentEl = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [currentType, setCurrentType] = useState(null)
    const [defaultHeight, setDefaultHeight] = useState(0)
    const [maxHeight, setMaxHeight] = useState(0)

    const DynamicComponent = components[currentType]

    useEffect(() => {
        const destroyBlur = blur(videoSettingEl.current, () => {
            setIsOpen(false)
            setCurrentType(null)
        })
        return () => {
            destroyBlur()
        }
    }, [])

    useEffect(() => {
        if (currentType) {
            setMaxHeight(contentEl.current.scrollHeight)
            return
        }
        setMaxHeight(displayContentEl.current.scrollHeight)
    }, [currentType])

    useEffect(() => {
        setDefaultHeight(displayContentEl.current.scrollHeight)
    }, [])

    useEffect(() => {
        onChangeSettingStatus(isOpen)
    }, [isOpen])

    return (
        <div
            className='video-setting'
            ref={videoSettingEl}
        >
            <div
                className='video-media__controls-item video-setting__display'
                onClick={() => setIsOpen(!isOpen)}
            >
                <SvgIcon name='setting' />
            </div>
            <div
                className={classNames('video-setting__main', {
                    '-open': isOpen,
                    '-active': currentType,
                })}
                style={{
                    '--height': defaultHeight,
                    '--max-height': maxHeight,
                }}
            >
                <div>
                    <div className='video-setting__content' ref={displayContentEl}>
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
                                ? <DynamicComponent onBack={(e) => setCurrentType(e)} transformPlaybackRate={transformPlaybackRate} playbackRate={playbackRate} onChangePlaybackRate={onChangePlaybackRate} />
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
    onChangePlaybackRate: PropTypes.func,
    onChangeSettingStatus: PropTypes.func,
}

export default VideoSetting
