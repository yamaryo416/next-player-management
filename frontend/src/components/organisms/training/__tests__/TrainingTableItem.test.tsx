import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing' 
import { RecoilRoot } from 'recoil'
import { TrainingTableItem } from '../TrainingTableItem'

import { mockMyProfileQuery } from '../../../../mocks/mockProfileData'
import { mockTrainingWithIcon } from '../../../../mocks/mockTrainingData'

afterEach(cleanup)

describe('TrainingTableItem', () => {
    describe('My team', () => {
        describe('As Coach', () => {
            it('Should render correct contents', async () => {
                render(
                    <MockedProvider mocks={ [mockMyProfileQuery(true, false)] }>
                        <RecoilRoot>
                            <TrainingTableItem node={mockTrainingWithIcon('1')} isMyTeam={true} />
                        </RecoilRoot>
                    </MockedProvider>
                )
                await new Promise(resolve => setTimeout(resolve, 0));
                expect(screen.getByRole('img')).toHaveAttribute('src', '/icon/white-barbell.png')
                expect(screen.queryByTestId('1-training-title')).toHaveTextContent('トレーニング1')
                expect(screen.queryByTestId('1-training-count')).toHaveTextContent('10')
                expect(screen.queryByTestId('1-training-load')).toHaveTextContent('20')
                expect(screen.queryByTestId('1-training-distance')).toHaveTextContent('30')
                expect(screen.queryByTestId('1-training-finished-count')).toHaveTextContent('0回')
                expect(screen.queryByTestId('1-training-edit-icon')).toBeInTheDocument()
                expect(screen.queryByTestId('1-training-delete-icon')).toBeInTheDocument()
            })
        })

        describe('As General', () => {
            it('Should render correct contents', async () => {
                render(
                    <MockedProvider mocks={ [mockMyProfileQuery(false, false)] }>
                        <RecoilRoot>
                            <TrainingTableItem node={mockTrainingWithIcon('1')} isMyTeam={true} />
                        </RecoilRoot>
                    </MockedProvider>
                )
                await new Promise(resolve => setTimeout(resolve, 0));
                expect(screen.queryByTestId('1-training-edit-icon')).not.toBeInTheDocument()
                expect(screen.queryByTestId('1-training-delete-icon')).not.toBeInTheDocument()
            })
        })

        describe('As Guest', () => {
            it('Should render correct contents', async () => {
                render(
                    <MockedProvider mocks={ [mockMyProfileQuery(false, true)] }>
                        <RecoilRoot>
                            <TrainingTableItem node={mockTrainingWithIcon('1')} isMyTeam={true} />
                        </RecoilRoot>
                    </MockedProvider>
                )
                await new Promise(resolve => setTimeout(resolve, 0));
                expect(screen.queryByTestId('1-training-finished-count')).not.toBeInTheDocument()
                expect(screen.queryByTestId('1-training-edit-icon')).not.toBeInTheDocument()
                expect(screen.queryByTestId('1-training-delete-icon')).not.toBeInTheDocument()
            })
        })
    })

    describe('Other team', () => {
        it('Should render correct contents', async () => {
            render(
                <MockedProvider mocks={ [mockMyProfileQuery(true, false)] }>
                    <RecoilRoot>
                        <TrainingTableItem node={mockTrainingWithIcon('1')} isMyTeam={false} />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.getByRole('img')).toHaveAttribute('src', '/icon/white-barbell.png')
            expect(screen.queryByTestId('1-training-title')).toHaveTextContent('トレーニング1')
            expect(screen.queryByTestId('1-training-count')).toHaveTextContent('10')
            expect(screen.queryByTestId('1-training-load')).toHaveTextContent('20')
            expect(screen.queryByTestId('1-training-distance')).toHaveTextContent('30')
            expect(screen.queryByTestId('1-training-finished-count')).not.toBeInTheDocument()
            expect(screen.queryByTestId('1-training-edit-icon')).not.toBeInTheDocument()
            expect(screen.queryByTestId('1-training-delete-icon')).not.toBeInTheDocument()
        })
    })

})