import React from "react";

// CSS-In-JSS
import { Container, NavBarArea, NavBarContainer, NavBarConnect, MainArea, FooterArea, FooterContainer, FooterBox } from './styles'

import { molecules } from '../../molecules'
const { Brand } = molecules


export function Home() {

    return (
        <Container>
            <NavBarArea>
                <NavBarContainer>
                    <Brand title="Casper Swap" url="https://via.placeholder.com/50" />
                    <NavBarConnect>
                        Connect
                    </NavBarConnect>
                </NavBarContainer>
            </NavBarArea>
            <MainArea>
                <img src="https://via.placeholder.com/300" />
            </MainArea>
            <FooterArea>
                <FooterContainer>
                    {["Swap", "Liquidity", "Pools", "Tokens"].map(box => {
                        return (<FooterBox key={box}>{box}</FooterBox>)
                    })}
                </FooterContainer>
            </FooterArea>
        </Container>
    );
}