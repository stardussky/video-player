import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './video-next.scss'

const VideoNext = ({ duration = 3, onChangeIsPlayNext, onNext }) => {
    const timer = useRef(null)
    const [countNumber, setCountNumber] = useState(duration)

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
            onNext()
        }, 1000)
    }

    const cancelCount = () => {
        window.clearTimeout(timer.current)
        onChangeIsPlayNext(false)
    }

    return (
        <div className='video-next'>
            <div className='video-next__main'>
                <p className='video-next__info'>下一個影片將在{countNumber}秒後播放</p>
                <div className='video-next__image' />
                {/* <p className='video-next__title'>title</p> */}
                <div className='video-next__content'>
                    <button className='video-next__button' onClick={cancelCount}>取消</button>
                    <button className='video-next__button' onClick={onNext}>立即播放</button>
                </div>
            </div>
        </div>
    )
}

VideoNext.propTypes = {
    duration: PropTypes.number,
    onChangeIsPlayNext: PropTypes.func,
    onNext: PropTypes.func,
}

export default VideoNext
