import '@testing-library/jest-dom/extend-expect'

import { cleanup, render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { mockFirstMyTeamMemberQuery, mockSecondMyTeamMemberQuery, mockFoundMyTeamMemberQuery, mockNotFoundMyTeamMemberQuery, mockErrorMyTeamMemberQuery } from '../../../mocks/mockProfileData';
import { MyTeamMemberListSection } from '../MyTeamMemberListSection';

const mocks = [
    mockFirstMyTeamMemberQuery,
    mockSecondMyTeamMemberQuery,
    mockFoundMyTeamMemberQuery,
    mockNotFoundMyTeamMemberQuery,
    mockFirstMyTeamMemberQuery,
    mockFirstMyTeamMemberQuery
]

const mocksError = [
    mockErrorMyTeamMemberQuery
]

afterEach(cleanup)

describe('MyTeamMemberListSection', () => {
    it('Should render without error', () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(screen.queryByText('My Team Member List')).toBeInTheDocument()
        expect(screen.queryAllByText('Loading...')[0]).toBeInTheDocument()
    })

    it('Should render correct contents', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(await screen.findByTestId('search-member-form')).toBeInTheDocument()
        expect(screen.queryByTestId('search-member-button')).toBeInTheDocument()
        expect(await screen.findByTestId('1-member-nickname')).toHaveTextContent('coach user')
        expect(screen.queryByTestId('1-member-join-date')).toHaveTextContent('2021年1月2日')
        expect(screen.queryByTestId('1-member-join-time')).toHaveTextContent('1時23分')
        expect(screen.queryByTestId('1-member-finished-schedule-count')).toHaveTextContent('1回')
        expect(screen.queryByTestId('10-member-nickname')).toHaveTextContent('user10')
        expect(screen.queryByTestId('10-member-join-date')).toHaveTextContent('2021年1月2日')
        expect(screen.queryByTestId('10-member-join-time')).toHaveTextContent('1時23分')
        expect(screen.queryByTestId('10-member-finished-schedule-count')).toHaveTextContent('10回')
        expect(screen.queryByTestId('my-team-member-fetch-more-button')).toBeInTheDocument()
    })

    it('Should display more member after click fetch more button', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.click(await screen.findByTestId('my-team-member-fetch-more-button'))
        expect(await screen.findByTestId('11-member-nickname')).toHaveTextContent('user11')
        expect(screen.queryByTestId('11-member-join-date')).toHaveTextContent('2021年1月2日')
        expect(screen.queryByTestId('11-member-join-time')).toHaveTextContent('1時23分')
        expect(screen.queryByTestId('11-member-finished-schedule-count')).toHaveTextContent('11回')
        expect(screen.queryByTestId('12-member-nickname')).toHaveTextContent('user12')
        expect(screen.queryByTestId('12-member-join-date')).toHaveTextContent('2021年1月2日')
        expect(screen.queryByTestId('12-member-join-time')).toHaveTextContent('1時23分')
        expect(screen.queryByTestId('12-member-finished-schedule-count')).toHaveTextContent('12回')
    })

    it('Should display searched member after click search button', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.type(await screen.findByTestId('search-member-form'), '2')
        userEvent.click(screen.queryByTestId('search-member-button'))
        expect(await screen.findByTestId('2-member-nickname')).toHaveTextContent('user2')
        expect(screen.queryByTestId('12-member-nickname')).toHaveTextContent('user12')
        expect(screen.queryByTestId('1-member-nickname')).not.toBeInTheDocument()
        userEvent.click(screen.queryByTestId('my-team-all-member-fetch-more-button'))
        expect(await screen.findByTestId('1-member-nickname')).toHaveTextContent('coach user')
        expect(await screen.findByTestId('10-member-nickname')).toHaveTextContent('user10')
    })

    it('Should display absent message after click search button', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.type(await screen.findByTestId('search-member-form'), 'hoge')
        userEvent.click(screen.queryByTestId('search-member-button'))
        expect(await screen.findByText('該当するメンバーはいません。')).toBeInTheDocument()
    })

    it('Should render error message', async () => {
        render(
            <MockedProvider mocks={mocksError}>
                <RecoilRoot>
                    <MyTeamMemberListSection />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(await screen.findByText('データの取得に失敗しました。')).toBeInTheDocument()
    })

})