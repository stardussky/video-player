import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './video-playback-rate.scss'

const VideoPlaybackRate = ({ onBack, transformPlaybackRate, initPlaybackRate, onChangePlaybackRate }) => {
    const rate = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    return (
        <ul className='video-playback-rate'>
            <li className='video-setting__item' onClick={() => onBack(null)}>
                <div className='video-setting__item-option video-setting__item-display'>
                    <p>播放速度</p>
                    <p>{transformPlaybackRate}</p>
                </div>
            </li>
            {
                rate.map(value => (
                    <li
                        className='video-setting__item'
                        key={value}
                        onClick={() => onChangePlaybackRate(value)}
                    >
                        <div className='video-setting__item-option'>
                            {value}
                        </div>
                    </li>
                ))
            }
            <li>
                <div
                    className='video-playback-rate__range video-setting__item-option'
                    style={{
                        '--progress': `${(initPlaybackRate - 0.125) / 2 * 100}%`,
                    }}
                >
                    <input
                        type='range'
                        min='0.25'
                        max='2'
                        step='0.01'
                        value={initPlaybackRate}
                        onChange={(e) => onChangePlaybackRate(Number(e.target.value))}
                    />
                </div>
            </li>
        </ul>
    )
}

VideoPlaybackRate.propTypes = {
    onBack: PropTypes.func,
    transformPlaybackRate: PropTypes.string,
    initPlaybackRate: PropTypes.number,
    onChangePlaybackRate: PropTypes.func,
}

export default VideoPlaybackRate
