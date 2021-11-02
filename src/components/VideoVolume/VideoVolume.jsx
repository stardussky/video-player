import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import './video-volume.scss'

const VideoVolume = ({ initVolume = '0.5', onVolumeChange }) => {
    // TODO 音量圖示根據大小變換
    const [volume, setVolume] = useState(initVolume)
    const [tempVolume, setTempVolume] = useState(volume)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        onVolumeChange(volume)
    }, [volume])

    const handleChange = (e) => {
        setVolume(e.target.value)
    }

    const handleMute = () => {
        if (isMuted) {
            setVolume(tempVolume)
        } else {
            setTempVolume(volume)
            setVolume('0')
        }
        setIsMuted(!isMuted)
    }

    return (
        <div
            className='video-volume'
            style={{
                '--progress': `${volume * 100}%`,
            }}
        >
            <SvgIcon name='volume' onClick={handleMute} />
            <input
                className='video-volume__range'
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={volume}
                onChange={handleChange}
            />
        </div>
    )
}

VideoVolume.propTypes = {
    initVolume: PropTypes.string,
    onVolumeChange: PropTypes.func,
}

export default VideoVolume
