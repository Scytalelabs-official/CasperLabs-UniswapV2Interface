import styled from 'styled-components'
import { Link } from "react-router-dom";

export const AnchorStyle = styled.a`
    color: ${props => props.theme.PrimaryColor};
`

export const LinkStyle = styled(Link)`
    color: ${props => props.theme.PrimaryColor};
`