import { createGlobalStyle } from 'styled-components'

export const lightTheme = {
    PrimaryColor: "rgba(255,255,255,1)",
}
export const darkTheme = {
    PrimaryColor: "rgba(255,255,255,1)",
}


export const GlobalStyles = createGlobalStyle`
    body{
        color:${props => props.theme.PrimaryColor};
    }
`