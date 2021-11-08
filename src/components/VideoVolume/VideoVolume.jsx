import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import './video-volume.scss'

const VideoVolume = ({ initVolume = '0.5', onChangeVolume }) => {
    // TODO 音量圖示根據大小變換
    const [volume, setVolume] = useState(initVolume)
    const [tempVolume, setTempVolume] = useState(volume)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        onChangeVolume(volume)
    }, [volume])

    const handleChange = (e) => {
        setVolume(e.target.value)
        if (e.target.value === '0') setIsMuted(true)
    }

    const handleMute = () => {
        if (isMuted) {
            setVolume(tempVolume === '0' ? 1 : tempVolume)
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
            <button
                className='video-media__controls-item'
                title={isMuted ? '解除靜音' : '靜音'}
                onClick={handleMute}
            >
                <SvgIcon name={isMuted ? 'mute' : 'volume'} />
            </button>
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
    onChangeVolume: PropTypes.func,
}

export default VideoVolume
