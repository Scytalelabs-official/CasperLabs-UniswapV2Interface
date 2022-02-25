import React from 'react'

import { Brand, ActionsBar } from '../../molecules'

import { NavBarStyle } from './styles'
export const NavBar = ({ title, url, isAnchor, to, content, isHome = true }) => {
    return (
        <NavBarStyle>
            <Brand title={title} url={url} />
            {isHome ? <>hola</> : <>no</>}
            <ActionsBar content={content} isAnchor={isAnchor} to={to} />
        </NavBarStyle>
    )
}
