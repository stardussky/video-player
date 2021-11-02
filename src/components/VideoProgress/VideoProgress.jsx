import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './video-progress.scss'
import VideoThumbnail from '@/components/VideoThumbnail/VideoThumbnail'

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
        this.handleStartDrag = this.handleStartDrag.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    componentDidMount () {
        if (this.progressEl.current) {
            this.setState({
                width: this.progressEl.current.clientWidth,
            })
        }
    }

    handleHover () {
        this.setState({
            isHover: true,
        })
        window.addEventListener('mousemove', this.handleMove)
        window.addEventListener('mouseup', this.handleReset)
    }

    handleBlur () {
        this.setState({
            isHover: false,
        })
        if (!this.state.canDrag) {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('mouseup', this.handleReset)
        }
    }

    handleStartDrag () {
        this.setState({
            canDrag: true,
        })

        this.beforeStatus = this.props.status
        this.props.onPause()
        this.props.onSetProgress(this.state.hoverProgress)
    }

    handleMove (e) {
        const { clientX } = e
        const { left } = this.progressEl.current.getBoundingClientRect()
        const { clientWidth } = this.progressEl.current

        const x = clientX - left
        const clampX = Math.max(Math.min(x, clientWidth), 0)
        const progress = clampX / clientWidth
        this.setState({
            hoverProgress: progress,
        })

        if (this.state.canDrag) {
            this.props.onSetProgress(this.state.hoverProgress)
        }
    }

    handleReset () {
        this.setState({
            canDrag: false,
        })
        if (this.beforeStatus) {
            this.props.onPlay()
        }
        if (!this.state.isHover) {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('mouseup', this.handleReset)
        }
    }

    get currentProgress () {
        return this.props.current / this.props.duration
    }

    get hoverTime () {
        return this.state.hoverProgress * this.props.duration
    }

    get transformHoverTime () {
        return new Date(this.hoverTime * 1000).toISOString().substr(11, 8)
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
                        <VideoThumbnail
                            videoEl='.video-media__main'
                            current={Math.ceil(this.hoverTime)}
                        />
                        <div className='video-progress__time'>
                            {this.transformHoverTime}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

VideoProgress.propTypes = {
    status: PropTypes.number,
    current: PropTypes.number,
    duration: PropTypes.number,
    buffered: PropTypes.number,
    onSetProgress: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
}

export default VideoProgress
