import React, { Component, createRef } from 'react'
import classNames from 'classnames'
import './video-media.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoProgress from '@/components/VideoProgress/VideoProgress'
import VideoVolume from '@/components/VideoVolume/VideoVolume'

class VideoMedia extends Component {
    constructor () {
        super()
        this.videoEl = createRef()
        this.state = {
            videoStatus: 0,
            videoCurrentTime: 0,
            videoDuration: 0,
            videoBuffered: 0,
            videoVolume: '0.5',
        }

        this.handleOnload = this.handleOnload.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handlePause = this.handlePause.bind(this)
        this.handleToggleStatus = this.handleToggleStatus.bind(this)
        this.handleChangeVolume = this.handleChangeVolume.bind(this)
        this.handleToggleFullscreen = this.handleToggleFullscreen.bind(this)
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

    handleToggleStatus () {
        const { videoStatus } = this.state
        if (!videoStatus) {
            this.handlePlay()
            return
        }
        this.handlePause()
    }

    handleChangeVolume (e) {
        this.videoEl.current.volume = e
        this.setState({
            videoVolume: e,
        })
    }

    handleToggleFullscreen () {
        if (document.fullscreen) {
            document.exitFullscreen()
            return
        }
        this.videoEl.current.parentNode.requestFullscreen()
    }

    handleOnTracked () {
        const { currentTime } = this.videoEl.current

        this.setState({
            videoCurrentTime: currentTime,
        })
    }

    handleOnProgress () {
        // TODO buffered顯示問題
        const { buffered, currentTime, duration } = this.videoEl.current

        let bufferProgress = 0
        for (let i = 0; i < buffered.length; i++) {
            if (buffered.start(buffered.length - 1 - i) < currentTime) {
                bufferProgress = (buffered.end(buffered.length - 1 - i) / duration)
                break
            }
        }

        this.setState({
            videoBuffered: bufferProgress,
        })
    }

    handleSetProgress (progress) {
        const { duration } = this.videoEl.current

        this.videoEl.current.currentTime = duration * progress
    }

    get transformTime () {
        return new Date(this.state.videoCurrentTime * 1000).toISOString().substr(11, 8)
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
                    <source src={new URL('../../assets/video/video1.mp4', import.meta.url).href} type='video/mp4' />
                    {/* <source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' /> */}
                </video>
                <div className={classNames('video-media__controls', {
                    '-active': !this.state.videoStatus,
                })}
                >
                    <span
                        className='video-media__controls-mask'
                        onClick={this.handleToggleStatus}
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
                                className='video-media__controls-item video-media__controls-status'
                                onClick={this.handleToggleStatus}
                            >
                                <SvgIcon name={this.state.videoStatus ? 'pause' : 'play'} />
                            </div>
                            <div className='video-media__time'>
                                {this.transformTime}
                            </div>
                            <VideoVolume
                                initVolume={this.state.videoVolume}
                                onVolumeChange={this.handleChangeVolume}
                            />
                            <div
                                className='video-media__controls-item video-media__controls-fullscreen'
                                onClick={this.handleToggleFullscreen}
                            >
                                <SvgIcon name='fullscreen' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoMedia
