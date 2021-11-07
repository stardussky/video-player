import React, { Component, createRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './video-media.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import VideoProgress from '@/components/VideoProgress/VideoProgress'
import VideoVolume from '@/components/VideoVolume/VideoVolume'
import VideoAutoNext from '@/components/VideoAutoNext/VideoAutoNext'
import VideoNext from '@/components/VideoNext/VideoNext'
import VideoSetting from '@/components/VideoSetting/VideoSetting'
import transformTime from '@/functions/transformTime'

class VideoMedia extends Component {
    constructor (props) {
        // TODO play pause currentTime 特效
        // TODO double click 手勢
        // TODO button hover title
        // TODO Icon 效果
        // TODO 子母畫面
        // TODO touch事件
        // TODO 彈幕
        super()
        this.videoEl = createRef()
        this.props = props
        this.state = {
            showSetting: false,
            showControl: false,
            autoNext: true,
            isPlayNext: true,
            // video status
            videoStatus: 0,
            videoCurrentTime: 0,
            videoDuration: 0,
            videoBuffered: 0,
            videoVolume: window.sessionStorage.getItem('volume') || '1',
            videoPlaybackRate: Number(window.sessionStorage.getItem('playbackRate')) || 1,
            videoEnded: false,
        }
        this.perTimeSeek = 5
        this.controlTimer = null

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
        this.handleOnSwitchAuto = this.handleOnSwitchAuto.bind(this)
        this.handleChangeIsPlayNext = this.handleChangeIsPlayNext.bind(this)
    }

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeydown)
    }

    componentDidUpdate (prevProps, prevState) {
        const { source } = this.props

        if (prevProps.source !== source) {
            this.videoEl.current.load()
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeydown)
    }

    handleOnload () {
        const { duration } = this.videoEl.current

        this.setState({
            videoDuration: duration,
        })
        this.loadedPreset()
    }

    handleChangeCurrentTime (e) {
        this.videoEl.current.currentTime = e
    }

    handlePlay () {
        const { videoEnded } = this.state
        if (videoEnded) this.handleChangeCurrentTime(0)

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
        window.sessionStorage.setItem('volume', volume)
    }

    handleChangePlaybackRate (e) {
        this.videoEl.current.playbackRate = e
        window.sessionStorage.setItem('playbackRate', e)
    }

    handlePlaybackRateStatus () {
        const { playbackRate } = this.videoEl.current

        this.setState({
            videoPlaybackRate: playbackRate,
        })
        // window.sessionStorage.setItem('playbackRate', playbackRate)
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
        window.sessionStorage.setItem('currentTime', currentTime)
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

        this.handleChangeCurrentTime(videoDuration * progress)
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
        const { videoCurrentTime, videoDuration } = this.state
        if (code === 'Space') {
            this.handleToggleStatus()
        }
        if (code === 'ArrowRight') {
            const time = Math.min(videoCurrentTime + this.perTimeSeek, videoDuration)
            this.handleChangeCurrentTime(time)
        }
        if (code === 'ArrowLeft') {
            this.handleChangeCurrentTime(videoCurrentTime - this.perTimeSeek)
        }
        this.changeControlStatus(true, true)
    }

    handleOnSwitchAuto (e) {
        this.setState({
            autoNext: e,
        })
    }

    handleChangeIsPlayNext (status) {
        this.setState({
            isPlayNext: status,
        })
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

    loadedPreset () {
        // TODO 須自動開始播放
        // TODO thumbnail重置
        this.loadSessionStorage()
        this.handleChangeIsPlayNext(true)
    }

    loadSessionStorage () {
        this.handleChangeCurrentTime(window.sessionStorage.getItem('currentTime'))
        this.handleChangeVolume(window.sessionStorage.getItem('volume'))
        this.handleChangePlaybackRate(window.sessionStorage.getItem('playbackRate'))
    }

    get isShowControl () {
        const { videoStatus, showControl } = this.state
        return !videoStatus || showControl
    }

    get isInfoNext () {
        const { videoEnded, autoNext, isPlayNext } = this.state
        return videoEnded && autoNext && isPlayNext
    }

    get transformTime () {
        const { videoCurrentTime } = this.state

        return transformTime(videoCurrentTime)
    }

    get transformTotalTime () {
        const { videoDuration } = this.state

        return transformTime(videoDuration)
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
                <div className='video-media__main'>
                    <video
                        playsInline
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
                        <source src={this.props.source.source} type='video/mp4' />
                    </video>
                </div>
                <div className={classNames('video-media__controls', {
                    '-active': this.isShowControl,
                })}
                >
                    <span
                        className='video-media__controls-mask'
                        onClick={this.handleToggleStatus}
                    />
                    <div
                        className={classNames('video-media__controls-info', {
                            '-active': this.isInfoNext,
                        })}
                    >
                        {this.isInfoNext
                            ? <VideoNext nextSource={this.props.nextSource} onChangeIsPlayNext={this.handleChangeIsPlayNext} onNext={this.props.onChangeNextVideo} />
                            : null}
                    </div>
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
                                <div className='video-media__controls-item' onClick={this.props.onChangeNextVideo}>
                                    <SvgIcon name='skip' />
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
                                <VideoAutoNext
                                    initAuto={this.state.autoNext}
                                    onSwitchAuto={this.handleOnSwitchAuto}
                                />
                                <VideoSetting
                                    transformPlaybackRate={this.transformPlaybackRate}
                                    initPlaybackRate={this.state.videoPlaybackRate}
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

VideoMedia.propTypes = {
    source: PropTypes.object,
    nextSource: PropTypes.object,
    onChangeNextVideo: PropTypes.func,
}

export default VideoMedia
