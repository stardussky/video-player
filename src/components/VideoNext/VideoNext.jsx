import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './video-next.scss'

const VideoNext = ({ nextSource, duration = 3, onChangeIsPlayNext, onNext }) => {
    const timer = useRef(null)
    const [countNumber, setCountNumber] = useState(duration)
    const [isNextLoading, setIsNextLoading] = useState(false)

    useEffect(() => {
        countDown()
        return () => {
            window.clearTimeout(timer.current)
        }
    }, [])

    const countDown = (count = countNumber) => {
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
            const num = count - 1
            setCountNumber(num)
            if (count > 1) {
                countDown(num)
                return
            }
            changeNext()
        }, 1000)
    }

    const cancelCount = () => {
        window.clearTimeout(timer.current)
        onChangeIsPlayNext(false)
    }

    const changeNext = () => {
        setIsNextLoading(true)
        onNext()
    }

    return (
        <div className={classNames('video-next', {
            '-active': !isNextLoading,
        })}
        >
            <div className='video-next__main'>
                <p className='video-next__info'>
                    {countNumber > 0 ? `下一個影片將在${countNumber}秒後播放` : '即將開始播放'}
                </p>
                <div className='video-next__content'>
                    <div
                        className='video-next__image'
                        style={{ background: `#111 url(${nextSource.thumbnail}) no-repeat center / cover` }}
                    />
                    <p className='video-next__title'>{nextSource.name}</p>
                </div>
                <div className='video-next__buttons'>
                    <button className='video-next__button' onClick={cancelCount}>取消</button>
                    <button className='video-next__button' onClick={changeNext}>立即播放</button>
                </div>
            </div>
        </div>
    )
}

VideoNext.propTypes = {
    nextSource: PropTypes.object,
    duration: PropTypes.number,
    onChangeIsPlayNext: PropTypes.func,
    onNext: PropTypes.func,
}

export default VideoNext
