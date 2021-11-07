import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './video-auto-next.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'

const VideoAutoNext = ({ initAuto = true, onSwitchAuto }) => {
    const [isAuto, setIsAuto] = useState(true)

    useEffect(() => {
        onSwitchAuto(isAuto)
    }, [isAuto])

    const handleSwitch = () => {
        setIsAuto(!isAuto)
    }

    return (
        <button
            title={isAuto ? '已啟用自動播放功能' : '已停用自動播放功能'}
            className={classNames('video-media__controls-item video-auto-next', {
                '-active': isAuto,
            })}
            onClick={handleSwitch}
        >
            <div className='video-auto-next__main'>
                <div className='video-auto-next__button'>
                    <SvgIcon name={isAuto ? 'play' : 'pause'} />
                </div>
            </div>
        </button>
    )
}

VideoAutoNext.propTypes = {
    initAuto: PropTypes.bool,
    onSwitchAuto: PropTypes.func,
}

export default VideoAutoNext
