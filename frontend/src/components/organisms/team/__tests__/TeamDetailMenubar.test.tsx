import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 

import { TeamDetailMenubar } from '../TeamDetailMenubar';
import { mockMyProfileQuery, mockMyProfileWithoutTeamBoardQuery } from '../../../../mocks/mockProfileData';

afterEach(cleanup)

describe('TeamDetailMenubar', () => {
    describe('My profile with Team board', () => {
        it('Should correct contents', async () => {
            render (
                <MockedProvider mocks={[ mockMyProfileQuery(true, false) ]}>
                    <RecoilRoot>
                        <TeamDetailMenubar teamName='test' />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.queryByText("test's Page")).toBeInTheDocument()
            expect(screen.queryByText('チーム一覧に戻る')).toBeInTheDocument()
            expect(screen.queryByText('チームに加入する')).not.toBeInTheDocument()
        })
    })

    describe('My profile without Team board', () => {
        it('Should correct contents', async () => {
            render (
                <MockedProvider mocks={[ mockMyProfileWithoutTeamBoardQuery(true, false) ]}>
                    <RecoilRoot>
                        <TeamDetailMenubar teamName='test' />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.queryByText('チームに加入する')).toBeInTheDocument()
        })
    })
})