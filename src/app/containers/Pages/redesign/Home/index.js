import React from "react";

import mainLogo from '../../../../assets/img/mainLogo.png'

// CSS-In-JSS
import { Container, NavBarArea, NavBarContainer, NavBarBrand, NavBarConnect,MainArea, FooterArea, FooterContainer, FooterBox } from './styles'


export function HomePage() {

    return (
        <Container>
            <NavBarArea>
                <NavBarContainer>
                    <NavBarBrand>
                        {/* eslint-disable-next-line jsx-a11y/alt-text*/}
                        <img src="https://via.placeholder.com/50" />
                        <h1>Casper Swap</h1>
                    </NavBarBrand>
                    <NavBarConnect>
                        Connect
                    </NavBarConnect>
                </NavBarContainer>
            </NavBarArea>
            <MainArea>
                <img src={mainLogo} />
            </MainArea>
            <FooterArea>
                <FooterContainer>
                    {["Swap", "Liquidity", "Pools", "Tokens"].map(box => {
                        return (<FooterBox>{box}</FooterBox>)
                    })}
                </FooterContainer>
            </FooterArea>
        </Container>
    );
}