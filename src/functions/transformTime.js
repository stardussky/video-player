export default (t) => {
    let time = t | 0
    const second = time % 60
    time = (time - second) / 60
    const minute = time % 60
    const hour = time / 60 | 0
    return `${hour ? String(hour).padStart(2, '0') + ':' : ''}${String(minute).padStart(2, '0') + ':'}${String(second).padStart(2, '0')}`
}
