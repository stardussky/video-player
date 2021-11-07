import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './video-progress.scss'
import VideoThumbnail from '@/components/VideoThumbnail/VideoThumbnail'
import transformTime from '@/functions/transformTime'

class VideoProgress extends Component {
    constructor (props) {
        super()
        this.progressEl = createRef()
        this.props = props
        this.state = {
            width: 0,
            hoverProgress: 0,
            isHover: false,
            canDrag: false,
        }

        this.handleHover = this.handleHover.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleTouchstart = this.handleTouchstart.bind(this)
        this.handleTouchend = this.handleTouchend.bind(this)
        this.handleStartDrag = this.handleStartDrag.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleMouseup = this.handleMouseup.bind(this)
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount () {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize)
    }

    handleHover () {
        this.setState({
            isHover: true,
        })
        window.addEventListener('mousemove', this.handleMove)
        window.addEventListener('mouseup', this.handleMouseup)
    }

    handleBlur () {
        this.setState({
            isHover: false,
        })
        if (!this.state.canDrag) {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('mouseup', this.handleMouseup)
        }
    }

    handleTouchstart (e) {
        this.setState({
            canDrag: true,
            isHover: true,
        }, () => {
            this.handleStartDrag()
            this.handleMove(e)
        })
        window.addEventListener('touchmove', this.handleMove)
        window.addEventListener('touchend', this.handleTouchend)
    }

    handleTouchend (e) {
        e.preventDefault()
        const { ended, onPlay } = this.props
        this.setState({
            isHover: false,
            canDrag: false,
        })
        if (this.beforeStatus) {
            if (!ended) {
                onPlay()
            }
        }
        window.removeEventListener('touchmove', this.handleMove)
        window.removeEventListener('touchend', this.handleTouchend)
    }

    handleStartDrag (e) {
        this.setState({
            canDrag: true,
        })

        this.beforeStatus = this.props.status
        this.props.onPause()
        this.props.onSetProgress(this.state.hoverProgress)
    }

    handleMove (e) {
        let clientX
        if (~e.type.indexOf('touch')) {
            ([{ clientX }] = e.touches)
        } else {
            ({ clientX } = e)
        }
        const { left } = this.progressEl.current.getBoundingClientRect()
        const { clientWidth } = this.progressEl.current

        const x = clientX - left
        const clampX = Math.max(Math.min(x, clientWidth), 0)
        const progress = clampX / clientWidth
        this.setState({
            hoverProgress: progress,
        }, () => {
            if (this.state.canDrag) {
                this.props.onSetProgress(this.state.hoverProgress)
            }
        })
    }

    handleMouseup () {
        const { ended, onPlay } = this.props
        this.setState({
            canDrag: false,
        })
        if (this.beforeStatus) {
            if (!ended) {
                onPlay()
            }
        }
        if (!this.state.isHover) {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('mouseup', this.handleMouseup)
        }
    }

    handleResize () {
        if (this.progressEl.current) {
            this.setState({
                width: this.progressEl.current.clientWidth,
            })
        }
    }

    get currentProgress () {
        return (this.props.currentTime / this.props.duration) || 0
    }

    get hoverTime () {
        return this.state.hoverProgress * this.props.duration
    }

    get transformHoverTime () {
        return transformTime(this.hoverTime)
    }

    render () {
        return (
            <div
                ref={this.progressEl}
                className='video-progress'
                style={{
                    '--width': this.state.width,
                    '--progress': this.currentProgress,
                    '--hover-progress': this.state.hoverProgress,
                    '--buffered-progress': this.props.buffered,
                }}
                onMouseEnter={this.handleHover}
                onTouchStart={this.handleTouchstart}
                onMouseDown={this.handleStartDrag}
                onMouseLeave={this.handleBlur}
            >
                <div className='video-progress__bar'>
                    <div className='video-progress__buffered' />
                    <div className='video-progress__hover' />
                    <div className='video-progress__current' />
                    <div className='video-progress__dot'>
                        <span />
                    </div>
                    <div className={classNames('video-progress__thumbnail', {
                        '-active': this.state.isHover || this.state.canDrag,
                    })}
                    >
                        <div className='video-progress__thumbnail-main'>
                            <VideoThumbnail
                                videoEl='.video-media__main video'
                                currentTime={Math.ceil(this.hoverTime)}
                            />
                            <div className='video-progress__time'>
                                {this.transformHoverTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

VideoProgress.propTypes = {
    status: PropTypes.number,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    buffered: PropTypes.number,
    ended: PropTypes.bool,
    onSetProgress: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
}

export default VideoProgress
