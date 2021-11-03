import React from 'react'
import PropTypes from 'prop-types'
import './svg-icon.scss'

function SvgIcon (props) {
    const { name } = props
    const symbolId = `#${name}`

    return (
        <svg
            {...props}
            className='icon svg-icon'
            aria-hidden='true'
        >
            <use href={symbolId} />
        </svg>
    )
}

SvgIcon.propTypes = {
    name: PropTypes.string,
}

export default SvgIcon
