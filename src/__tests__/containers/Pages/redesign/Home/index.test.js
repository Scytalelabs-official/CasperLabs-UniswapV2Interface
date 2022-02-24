import React from 'react'
import { HomePage } from '../../../../../app/containers/Pages/redesign/Home'
import { render, screen } from '@testing-library/react'

describe("Home Component Suite", () => {
    test("Home load", () => {
        render(<HomePage />)
        expect(screen.getByText('Casper Swap')).toBeInTheDocument()
    })
})