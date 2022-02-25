import React from 'react'

import { Button, Anchor } from '../../atoms'

import { ActionsStyles } from './styles'

export const ActionsBar = ({ isAnchor, to, content }) => {
    return (
        <ActionsStyles>
            <Anchor isAnchor={isAnchor} to={to} />
            <Button content={content} />
        </ActionsStyles>
    )
}
