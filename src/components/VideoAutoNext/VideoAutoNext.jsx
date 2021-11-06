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
        <div
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
        </div>
    )
}

VideoAutoNext.propTypes = {
    initAuto: PropTypes.bool,
    onSwitchAuto: PropTypes.func,
}

export default VideoAutoNext
