import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DeleteButton } from '../DeleteButton'
import { PrimaryButton } from '../PrimaryButton'
import { SecondaryButton } from '../SecondaryButton'

afterEach(cleanup)

describe('PrimaryButton', () => {
    const handleClick = jest.fn() 

    it('Should render correct text and Should calle handle click as clicked', () => {
        render(
            <PrimaryButton
                name='test'
                type = "button"
                disabled={false}
                onClick={() => handleClick()}
            >
                first
            </PrimaryButton>
        )
        expect(screen.getByTestId('test-button')).toBeInTheDocument()
        expect(screen.getByText('first')).toBeInTheDocument()
        userEvent.click(screen.getByText('first'))
        expect(handleClick).toBeCalled()
    })

    it('Should have disabled attribute', () => {
        render(
            <PrimaryButton
                name='test'
                type = "button"
                disabled={true}
                onClick={() => handleClick()}
            >
                first
            </PrimaryButton>
        )
        expect(screen.getByTestId('test-button')).toHaveAttribute('disabled')
    })
})

describe('SecondaryButton', () => {
    const handleClick = jest.fn() 

    it('Should render correct text and Should calle handle click as clicked', () => {
        render(
            <SecondaryButton
                onClick={() => handleClick()}
            >
                second
            </SecondaryButton>
        )
        expect(screen.getByText('second')).toBeInTheDocument()
        userEvent.click(screen.getByText('second'))
        expect(handleClick).toBeCalled()
    })
})

describe('DeleteButton', () => {
    const handleClick = jest.fn() 

    it('Should render correct text and Should calle handle click as clicked', () => {
        render(
            <DeleteButton
                name='test'
                type='button'
                disabled={false}
                onClick={() => handleClick()}
            >
                delete
            </DeleteButton>
        )
        expect(screen.queryByTestId('test-button')).toBeInTheDocument()
        expect(screen.getByText('delete')).toBeInTheDocument()
        userEvent.click(screen.getByText('delete'))
        expect(handleClick).toBeCalled()
    })

    it('Should have disabled attribute', () => {
        render(
            <DeleteButton
                name='test'
                type='button'
                disabled={true}
                onClick={() => handleClick()}
            >
                delete
            </DeleteButton>
        )
        expect(screen.getByTestId('test-button')).toHaveAttribute('disabled')
    })
})
