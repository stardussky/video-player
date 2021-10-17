import React, { Component, createRef } from 'react'
import './video-media.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoProgress from '@/components/VideoProgress/VideoProgress'
class VideoMedia extends Component {
    constructor () {
        super()
        this.videoEl = createRef()
        this.state = {
            videoStatus: 0,
            videoCurrentTime: 0,
            videoDuration: 0,
            videoBuffered: 0,
        }

        this.handleOnload = this.handleOnload.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handlePause = this.handlePause.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleOnTracked = this.handleOnTracked.bind(this)
        this.handleOnProgress = this.handleOnProgress.bind(this)
        this.handleSetProgress = this.handleSetProgress.bind(this)
    }

    handleOnload () {
        const { duration } = this.videoEl.current
        this.setState({
            videoDuration: duration,
        })
    }

    handlePlay () {
        this.videoEl.current.play()
        this.setState({
            videoStatus: 1,
        })
    }

    handlePause () {
        this.videoEl.current.pause()
        this.setState({
            videoStatus: 0,
        })
    }

    handleToggle () {
        const { videoStatus } = this.state
        if (!videoStatus) {
            this.handlePlay()
            return
        }
        this.handlePause()
    }

    handleOnTracked () {
        const { currentTime } = this.videoEl.current

        this.setState({
            videoCurrentTime: currentTime,
        })
    }

    handleOnProgress () {
        const { buffered, currentTime, duration } = this.videoEl.current

        // if (buffered.length) {
        //     let range = 0
        //     while (!(buffered.start(range) <= currentTime && currentTime <= buffered.end(range))) {
        //         range += 1
        //     }
        //     const startProgress = buffered.start(range) / duration
        //     const endProgress = buffered.end(range) / duration
        //     const bufferProgress = endProgress - startProgress

        //     this.setState({
        //         videoBuffered: bufferProgress,
        //     })
        // }
    }

    handleSetProgress (progress) {
        const { duration } = this.videoEl.current

        this.videoEl.current.currentTime = duration * progress
    }

    render () {
        return (
            <div className='video-media'>
                <video
                    className='video-media__main'
                    ref={this.videoEl}
                    onLoadedMetadata={this.handleOnload}
                    onTimeUpdate={this.handleOnTracked}
                    onSeeking={this.handleOnTracked}
                    onProgress={this.handleOnProgress}
                >
                    <source src='assets/video/video1.mp4' type='video/mp4' />
                    {/* <source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' /> */}
                </video>
                <div className='video-media__controls'>
                    <span
                        className='video-media__controls-mask'
                        onClick={this.handleToggle}
                    />
                    <div className='video-media__controls-main'>
                        <VideoProgress
                            status={this.state.videoStatus}
                            current={this.state.videoCurrentTime}
                            duration={this.state.videoDuration}
                            buffered={this.state.videoBuffered}
                            onPause={this.handlePause}
                            onPlay={this.handlePlay}
                            onSetProgress={this.handleSetProgress}
                        />
                        <div className='video-media__controls-list'>
                            <div
                                className='video-media__controls-status'
                                onClick={this.handleToggle}
                            >
                                <SvgIcon name={this.state.videoStatus ? 'pause' : 'play'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoMedia
