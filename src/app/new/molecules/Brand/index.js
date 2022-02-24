import React from 'react'
import { atoms } from '../../atoms'
import { BrandStyles } from './styles'

const { Title, ImgRender } = atoms


export const Brand = ({ title, url }) => {
    return (
        <BrandStyles>
            <ImgRender url={url} />
            <Title title={title} />
        </BrandStyles>
    )
}
