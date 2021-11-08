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
        // TODO 彈幕
        super()
        this.videoEl = createRef()
        this.props = props
        this.state = {
            isFirstEnter: false,
            showIconsTip: false,
            showSetting: false,
            showControl: false,
            autoNext: true,
            isPlayNext: true,
            perTimeSeek: 5,
            tipStatus: null,
            // video status
            videoStatus: 0,
            videoCurrentTime: 0,
            videoDuration: 0,
            videoBuffered: 0,
            videoVolume: window.sessionStorage.getItem('volume') || '1',
            videoPlaybackRate: Number(window.sessionStorage.getItem('playbackRate')) || 1,
            videoEnded: false,
        }
        this.controlTimer = null
        this.tipTimer = null
        this.tipDuration = 1
        this.tapTimer = null
        this.isTapOnce = false

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
        // picture in picture
        this.handleTogglePictureInPicture = this.handleTogglePictureInPicture.bind(this)

        this.handleOnTracked = this.handleOnTracked.bind(this)
        this.handleOnProgress = this.handleOnProgress.bind(this)
        this.handleSetProgress = this.handleSetProgress.bind(this)
        this.handleChangeSettingStatus = this.handleChangeSettingStatus.bind(this)
        this.switchIconsTip = this.switchIconsTip.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
        this.handleTouchstart = this.handleTouchstart.bind(this)
        this.handleDoubleTap = this.handleDoubleTap.bind(this)
        this.handleOnSwitchAuto = this.handleOnSwitchAuto.bind(this)
        this.handleChangeIsPlayNext = this.handleChangeIsPlayNext.bind(this)
    }

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeydown)
    }

    componentDidUpdate (prevProps, prevState) {
        const { source } = this.props

        if (prevProps.source !== source) {
            window.sessionStorage.setItem('currentTime', 0)
            this.videoEl.current.load()
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeydown)
    }

    handleOnload () {
        const { duration } = this.videoEl.current

        this.setState({
            videoStatus: 0,
            videoDuration: duration,
        })
        this.loadedPreset()
    }

    handleChangeCurrentTime (e) {
        this.videoEl.current.currentTime = e
    }

    handlePlay (showTip = true) {
        const { videoEnded } = this.state
        if (videoEnded) this.handleChangeCurrentTime(0)

        this.videoEl.current.play()
        this.switchIconsTip(showTip)
    }

    handlePause (showTip = true) {
        this.videoEl.current.pause()
        this.switchIconsTip(showTip)
    }

    handleToggleStatus (showTip = true) {
        const { videoStatus } = this.state

        if (!videoStatus) {
            this.handlePlay(showTip)
            return
        }
        this.handlePause(showTip)
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
            document.exitFullscreen?.() || document.webkitCancelFullScreen?.()
            return
        }
        this.videoEl.current.parentNode.parentNode.requestFullscreen?.() ||
        this.videoEl.current.parentNode.parentNode.webkitRequestFullScreen?.() ||
        this.videoEl.current.webkitEnterFullscreen?.()
    }

    handleTogglePictureInPicture () {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
        } else {
            if (document.pictureInPictureEnabled) {
                this.videoEl.current.requestPictureInPicture()
            }
        }
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
        this.changeControlStatus(true, true)
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
            e.preventDefault()
            this.handleToggleStatus()
        }
        if (code === 'ArrowRight') {
            e.preventDefault()
            this.fastForward()
        }
        if (code === 'ArrowLeft') {
            e.preventDefault()
            this.fastBackward()
        }
        this.changeControlStatus(true, true)
        this.switchIconsTip()
    }

    handleTouchstart (e) {
        this.changeControlStatus(true, true)
        if (this.isShowControl) {
            this.handleToggleStatus()
        }
    }

    handleDoubleTap (position) {
        if (!this.isTapOnce) {
            this.isTapOnce = true
            this.tapTimer = window.setTimeout(() => {
                this.handleTouchstart()
            }, 300)
            window.setTimeout(() => {
                this.isTapOnce = false
            }, 300)
            return
        }
        window.clearTimeout(this.tapTimer)
        if (position === 'left') {
            this.fastBackward()
        }
        if (position === 'right') {
            this.fastForward()
        }
        this.changeControlStatus(true, true)
        this.switchIconsTip()
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

    fastForward () {
        const { perTimeSeek, videoCurrentTime, videoDuration } = this.state
        const time = Math.min(videoCurrentTime + perTimeSeek, videoDuration)
        this.handleChangeCurrentTime(time)
        this.setState({
            tipStatus: null,
        })
        setTimeout(() => {
            this.setState({
                tipStatus: 'forward',
            })
        }, 50)
    }

    fastBackward () {
        const { perTimeSeek, videoCurrentTime } = this.state
        this.handleChangeCurrentTime(videoCurrentTime - perTimeSeek)
        this.setState({
            tipStatus: null,
        })
        setTimeout(() => {
            this.setState({
                tipStatus: 'backward',
            })
        }, 50)
    }

    changeControlStatus (status, autoClose = false) {
        status = status === undefined ? !this.state.showControl : status
        window.clearTimeout(this.controlTimer)
        this.controlTimer = window.setTimeout(() => {
            this.setState({
                showControl: status,
            })
            if (status && autoClose) this.changeControlStatus(false)
        }, status ? 0 : 3000)
    }

    switchIconsTip (status = true) {
        window.clearTimeout(this.tipTimer)
        this.setState({ showIconsTip: status })
        if (status) {
            this.tipTimer = window.setTimeout(() => {
                this.setState({ showIconsTip: false })
            }, this.tipDuration * 1000)
        }
    }

    loadedPreset () {
        this.loadSessionStorage()
        this.handleChangeIsPlayNext(true)
        if (this.state.isFirstEnter) {
            this.handlePlay(false)
        }
        this.setState({
            isFirstEnter: true,
        })
    }

    loadSessionStorage () {
        this.handleChangeCurrentTime(window.sessionStorage.getItem('currentTime'))
        this.handleChangeVolume(window.sessionStorage.getItem('volume') || '1')
        this.handleChangePlaybackRate(Number(window.sessionStorage.getItem('playbackRate')) || 1)
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
                    <div
                        className={classNames('video-media__controls-mask', {
                            '-active': this.state.showIconsTip,
                            '-play': this.state.videoStatus,
                            '-pause': !this.state.videoStatus,
                            '-forward': this.state.tipStatus === 'forward',
                            '-backward': this.state.tipStatus === 'backward',
                        })}
                        style={{ '--tip-duration': this.tipDuration }}
                        onClick={this.handleToggleStatus}
                        onDoubleClick={this.handleToggleFullscreen}
                    >
                        <div className='video-media__controls-mask-icon -play'>
                            <span>
                                <SvgIcon name='play' />
                            </span>
                        </div>
                        <div className='video-media__controls-mask-icon -pause'>
                            <span>
                                <SvgIcon name='pause' />
                            </span>
                        </div>
                        <div className='video-media__controls-mask-icon -forward'>
                            <span>
                                {this.state.perTimeSeek}秒
                            </span>
                        </div>
                        <div className='video-media__controls-mask-icon -backward'>
                            <span>
                                {this.state.perTimeSeek}秒
                            </span>
                        </div>
                        <div
                            className='video-media__controls-tap-area -left'
                            onTouchStart={() => this.handleDoubleTap('left')}
                            onTouchEnd={(e) => e.preventDefault()}
                        />
                        <div
                            className='video-media__controls-tap-area -right'
                            onTouchStart={() => this.handleDoubleTap('right')}
                            onTouchEnd={(e) => e.preventDefault()}
                        />
                    </div>
                    <div
                        className={classNames('video-media__controls-info', {
                            '-active': this.isInfoNext,
                        })}
                    >
                        {this.isInfoNext
                            ? <VideoNext nextSource={this.props.nextSource} onChangeIsPlayNext={this.handleChangeIsPlayNext} onNext={this.props.onChangeNextVideo} />
                            : null}
                    </div>
                    <div
                        className={classNames('video-media__controls-main', {
                            '-setting': this.state.showSetting,
                        })}
                    >
                        <VideoProgress
                            key={this.props.source.name}
                            status={this.state.videoStatus}
                            currentTime={this.state.videoCurrentTime}
                            duration={this.state.videoDuration}
                            buffered={this.state.videoBuffered}
                            ended={this.state.videoEnded}
                            onPause={this.handlePause}
                            onPlay={this.handlePlay}
                            onSetProgress={this.handleSetProgress}
                        />
                        <span className='video-media__setting-mask' />
                        <div className='video-media__controls-list'>
                            <div className='video-media__controls-items'>
                                <button
                                    title={this.state.videoEnded ? '重播' : this.state.videoStatus ? '暫停' : '播放'}
                                    className='video-media__controls-item video-media__controls-status'
                                    onClick={this.handleToggleStatus}
                                >
                                    <SvgIcon name={this.state.videoEnded ? 'replay' : this.state.videoStatus ? 'pause' : 'play'} />
                                </button>
                                <button
                                    title='下一個'
                                    className='video-media__controls-item'
                                    onClick={this.props.onChangeNextVideo}
                                >
                                    <SvgIcon name='skip' />
                                </button>
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
                                <button
                                    title='迷你播放器'
                                    className='video-media__controls-item video-media__controls-picture-in-picture'
                                    onClick={this.handleTogglePictureInPicture}
                                >
                                    <SvgIcon name='picture' />
                                </button>
                                <button
                                    title='全螢幕'
                                    className='video-media__controls-item video-media__controls-fullscreen'
                                    onClick={this.handleToggleFullscreen}
                                >
                                    <SvgIcon name='fullscreen' />
                                </button>
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
