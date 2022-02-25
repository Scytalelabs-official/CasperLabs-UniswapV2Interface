import React from 'react'
import { AnchorStyle, LinkStyle } from './styles'

export const Anchor = ({ isAnchor = true, to }) => {
    if (isAnchor) {
        return <AnchorStyle href={to}> index</AnchorStyle >
    }
    return (<LinkStyle to={to} > index</LinkStyle >)
}
