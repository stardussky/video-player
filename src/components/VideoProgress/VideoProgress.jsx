import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import './video-progress.scss'

class VideoProgress extends Component {
    constructor (props) {
        super()
        this.progressEl = createRef()
        this.props = props
        this.state = {}

        this.handleStartDrag = this.handleStartDrag.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleReset = this.handleReset.bind(this)

        this.canDrag = false
        this.hoverProgress = 0
    }

    componentDidMount () {
        window.addEventListener('mousemove', this.handleMove)
        window.addEventListener('mouseup', this.handleReset)
    }

    componentWillUnmount () {
        window.removeEventListener('mousemove', this.handleMove)
        window.removeEventListener('mouseup', this.handleReset)
    }

    handleStartDrag () {
        this.canDrag = true

        this.beforeStatus = this.props.status
        this.props.onPause()
        this.props.onSetProgress(this.hoverProgress)
    }

    handleMove (e) {
        const { clientX } = e
        const { left } = this.progressEl.current.getBoundingClientRect()
        const { clientWidth } = this.progressEl.current

        const x = clientX - left
        const clampX = Math.max(Math.min(x, clientWidth), 0)
        const progress = clampX / clientWidth
        this.hoverProgress = progress

        if (this.canDrag) {
            this.props.onSetProgress(this.hoverProgress)
        }
    }

    handleReset () {
        this.canDrag = false
        if (this.beforeStatus) {
            this.props.onPlay()
        }
    }

    get currentProgress () {
        return this.props.current / this.props.duration
    }

    render () {
        return (
            <div
                ref={this.progressEl}
                className='video-progress'
                style={{
                    '--progress': this.currentProgress,
                    '--buffered-progress': this.props.buffered,
                }}
                onMouseDown={this.handleStartDrag}
            >
                <div className='video-progress__bar'>
                    <div className='video-progress__buffered' />
                    <div className='video-progress__hover' />
                    <div className='video-progress__current' />
                    <div className='video-progress__dot'>
                        <span />
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
