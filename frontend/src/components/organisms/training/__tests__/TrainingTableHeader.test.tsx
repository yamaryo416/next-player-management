import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing' 

import { TrainingTableHeader } from '../TrainingTableHeader';
import { mockMyProfileQuery } from '../../../../mocks/mockProfileData';

afterEach(cleanup)

describe('TrainingTableHeader', () => {
    describe('As My team', () => {
        it('Should render correct contents', () => {
            render(
                <MockedProvider mocks={ [mockMyProfileQuery(true, false)] }>
                    <TrainingTableHeader isMyTeam={true} />
                </MockedProvider>
            )
            expect(screen.queryByText('タイトル')).toBeInTheDocument()
            expect(screen.queryByText('回')).toBeInTheDocument()
            expect(screen.queryByText('kg')).toBeInTheDocument()
            expect(screen.queryByText('km')).toBeInTheDocument()
            expect(screen.queryByText('実施回数')).toBeInTheDocument()
        })
    })

    describe('As Other team', () => {
        it('Should render correct contents', () => {
            render(
                <MockedProvider mocks={ [mockMyProfileQuery(true, false)] }>
                    <TrainingTableHeader isMyTeam={false} />
                </MockedProvider>
            )
            expect(screen.queryByText('実施回数')).not.toBeInTheDocument()
        })
    })
})