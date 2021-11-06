import React, { Component, createRef } from 'react'
import classNames from 'classnames'
import './video-media.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoProgress from '@/components/VideoProgress/VideoProgress'
import VideoVolume from '@/components/VideoVolume/VideoVolume'
import VideoSetting from '@/components/VideoSetting/VideoSetting'

class VideoMedia extends Component {
    constructor () {
        // TODO cookie 影片時間
        super()
        this.videoEl = createRef()
        this.state = {
            showSetting: false,
            showControl: false,
            // video status
            videoStatus: 0,
            videoCurrentTime: 0,
            videoDuration: 0,
            videoBuffered: 0,
            videoVolume: '0.5',
            videoPlaybackRate: 1,
            videoEnded: false,
        }
        this.perTimeSeek = 5

        // load
        this.handleOnload = this.handleOnload.bind(this)
        // video status
        this.handlePlay = this.handlePlay.bind(this)
        this.handlePause = this.handlePause.bind(this)
        this.handleToggleStatus = this.handleToggleStatus.bind(this)
        this.handleVideoStatus = this.handleVideoStatus.bind(this)
        // volume
        this.handleChangeVolume = this.handleChangeVolume.bind(this)
        this.handleVolumeStatus = this.handleVolumeStatus.bind(this)
        // playback rate
        this.handleChangePlaybackRate = this.handleChangePlaybackRate.bind(this)
        this.handlePlaybackRateStatus = this.handlePlaybackRateStatus.bind(this)
        // fullscreen
        this.handleToggleFullscreen = this.handleToggleFullscreen.bind(this)

        this.handleOnTracked = this.handleOnTracked.bind(this)
        this.handleOnProgress = this.handleOnProgress.bind(this)
        this.handleSetProgress = this.handleSetProgress.bind(this)
        this.handleChangeSettingStatus = this.handleChangeSettingStatus.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
    }

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeydown)
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeydown)
    }

    handleOnload () {
        const { duration } = this.videoEl.current
        this.setState({
            videoDuration: duration,
        })
    }

    handlePlay () {
        const { videoEnded } = this.state
        if (videoEnded) this.videoEl.current.currentTime = 0

        this.videoEl.current.play()
    }

    handlePause () {
        this.videoEl.current.pause()
    }

    handleToggleStatus () {
        const { videoStatus } = this.state

        if (!videoStatus) {
            this.handlePlay()
            return
        }
        this.handlePause()
    }

    handleVideoStatus () {
        const { paused } = this.videoEl.current
        this.setState({
            videoStatus: !paused | 0,
        })
    }

    handleChangeVolume (e) {
        this.videoEl.current.volume = e
    }

    handleVolumeStatus () {
        const { volume } = this.videoEl.current

        this.setState({
            videoVolume: String(volume),
        })
    }

    handleChangePlaybackRate (e) {
        this.videoEl.current.playbackRate = e
    }

    handlePlaybackRateStatus () {
        const { playbackRate } = this.videoEl.current

        this.setState({
            videoPlaybackRate: playbackRate,
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
        const { currentTime, duration } = this.videoEl.current

        this.setState({
            videoCurrentTime: currentTime,
            videoEnded: currentTime === duration,
        })
    }

    handleOnProgress () {
        // TODO buffered顯示問題
        const { videoCurrentTime, videoDuration } = this.state
        const { buffered } = this.videoEl.current

        let bufferProgress = 0
        for (let i = 0; i < buffered.length; i++) {
            if (buffered.start(buffered.length - 1 - i) < videoCurrentTime) {
                bufferProgress = (buffered.end(buffered.length - 1 - i) / videoDuration)
                break
            }
        }

        this.setState({
            videoBuffered: bufferProgress,
        })
    }

    handleSetProgress (progress) {
        const { videoDuration } = this.state

        this.videoEl.current.currentTime = videoDuration * progress
    }

    handleChangeSettingStatus (status) {
        this.changeControlStatus(status)
        if (status !== undefined) {
            this.setState({
                showSetting: status,
            })
            return
        }
        this.setState({
            showSetting: !this.state.showSetting,
        })
    }

    handleKeydown (e) {
        const { code } = e
        if (code === 'Space') {
            this.handleToggleStatus()
        }
        if (code === 'ArrowRight') {
            const { videoCurrentTime, videoDuration } = this.state
            const time = Math.min(videoCurrentTime + this.perTimeSeek, videoDuration)
            this.videoEl.current.currentTime = time
        }
        if (code === 'ArrowLeft') {
            this.videoEl.current.currentTime -= this.perTimeSeek
        }
        this.changeControlStatus(true, true)
    }

    changeControlStatus (status, autoClose = false) {
        status = status === undefined ? !this.state.showControl : status
        window.clearTimeout(this.controlTimer)
        this.controlTimer = window.setTimeout(() => {
            this.setState({
                showControl: status,
            })
            if (status && autoClose) this.changeControlStatus(false)
        }, status ? 0 : 2000)
    }

    get isShowControl () {
        return !this.state.videoStatus || this.state.showControl
    }

    get transformTime () {
        return new Date(this.state.videoCurrentTime * 1000).toISOString().substr(11, 8)
    }

    get transformTotalTime () {
        return new Date(this.state.videoDuration * 1000).toISOString().substr(11, 8)
    }

    get transformPlaybackRate () {
        const map = new Map([
            [0.25, '0.25'],
            [0.5, '0.5'],
            [0.75, '0.75'],
            [1, '正常'],
            [1.25, '1.25'],
            [1.5, '1.5'],
            [1.75, '1.75'],
            [2, '2'],
        ])
        return map.get(this.state.videoPlaybackRate) || String(this.state.videoPlaybackRate)
    }

    render () {
        return (
            <div className='video-media'>
                <video
                    className='video-media__main'
                    ref={this.videoEl}
                    onLoadedMetadata={this.handleOnload}
                    onPlay={this.handleVideoStatus}
                    onPause={this.handleVideoStatus}
                    onVolumeChange={this.handleVolumeStatus}
                    onRateChange={this.handlePlaybackRateStatus}
                    onTimeUpdate={this.handleOnTracked}
                    onSeeking={this.handleOnTracked}
                    onProgress={this.handleOnProgress}
                >
                    <source src={new URL('../../assets/video/video1.mp4', import.meta.url).href} type='video/mp4' />
                    {/* <source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' /> */}
                </video>
                <div className={classNames('video-media__controls', {
                    '-active': this.isShowControl,
                })}
                >
                    <span
                        className='video-media__controls-mask'
                        onClick={this.handleToggleStatus}
                    />
                    <div className='video-media__controls-main'>
                        <VideoProgress
                            status={this.state.videoStatus}
                            currentTime={this.state.videoCurrentTime}
                            duration={this.state.videoDuration}
                            buffered={this.state.videoBuffered}
                            ended={this.state.videoEnded}
                            onPause={this.handlePause}
                            onPlay={this.handlePlay}
                            onSetProgress={this.handleSetProgress}
                        />
                        <span
                            className={classNames('video-media__setting-mask', {
                                '-active': this.state.showSetting,
                            })}
                        />
                        <div className='video-media__controls-list'>
                            <div className='video-media__controls-items'>
                                <div
                                    className='video-media__controls-item video-media__controls-status'
                                    onClick={this.handleToggleStatus}
                                >
                                    <SvgIcon name={this.state.videoEnded ? 'replay' : this.state.videoStatus ? 'pause' : 'play'} />
                                </div>
                                <div className='video-media__time'>
                                    {this.transformTime} / {this.transformTotalTime}
                                </div>
                                <VideoVolume
                                    initVolume={this.state.videoVolume}
                                    onChangeVolume={this.handleChangeVolume}
                                />
                            </div>
                            <div className='video-media__controls-items'>
                                <VideoSetting
                                    transformPlaybackRate={this.transformPlaybackRate}
                                    playbackRate={this.state.videoPlaybackRate}
                                    onChangePlaybackRate={this.handleChangePlaybackRate}
                                    onChangeSettingStatus={this.handleChangeSettingStatus}
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
            </div>
        )
    }
}

export default VideoMedia
