import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FetchMoreLink } from '../FetchMoreLink'
import { SectionCloseLink } from '../SectionCloseLink'

afterEach(cleanup)

describe('FetchMoreLink', () => {
    const handleClick = jest.fn() 

    it('Should render correct text and Should calle handle click as clicked', () => {
        render(
            <FetchMoreLink
                name='test'
                onClick={() => handleClick()}
                text='Fetch More Link'
            />
        )
        expect(screen.queryByTestId('test-fetch-more-button'))
        expect(screen.queryByText('Fetch More Link')).toBeInTheDocument()
        userEvent.click(screen.getByText('Fetch More Link'))
        expect(handleClick).toBeCalled()
    })
})

describe('SectionCloseLink', () => {
    const handleClick = jest.fn() 

    it('Should render correct text and Should calle handle click as clicked', () => {
        render(
            <SectionCloseLink
                name='test'
                onClick={() => handleClick()}
            />
        )
        expect(screen.queryByTestId('test-close-button'))
        userEvent.click(screen.getByText('閉じる'))
        expect(handleClick).toBeCalled()
    })
})

