import React from 'react'
import { NavBar } from '../../organisms'
import { Container } from './styles'
export const HomeTemplate = ({ title = 'inside title', url = 'https://via.placeholder.com/50', content = 'inside button', isAnchor = false, to = '/', }) => {
  return (
    <Container>
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} />
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} />
      <NavBar title={title} url={url} content={content} isAnchor={isAnchor} to={to} />
    </Container>
  )
}
