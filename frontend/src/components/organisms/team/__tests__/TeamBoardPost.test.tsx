import '@testing-library/jest-dom/extend-expect'

import moment from "moment";
import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { mockMyProfileQuery } from '../../../../mocks/mockProfileData';
import { mockFirstMyTeamPostsQuery, mockSecondMyTeamPostsQuery, mockErrorMyTeamPostsQuery, mockAbsentMyTeamPostsQuery } from '../../../../mocks/mockPostData';
import { TeamBoardPost } from '../TeamBoardPost';

const mocksCoach = [
    mockMyProfileQuery(true, false),
    mockFirstMyTeamPostsQuery,
    mockSecondMyTeamPostsQuery,
    mockFirstMyTeamPostsQuery
]

const mocksGeneral = [
    mockMyProfileQuery(false, false),
    mockFirstMyTeamPostsQuery
]

const mocksGuest = [
    mockMyProfileQuery(false, true),
    mockFirstMyTeamPostsQuery
]

const mocksErrorPostData = [
    mockMyProfileQuery(true, false),
    mockErrorMyTeamPostsQuery
]

const mocksAbsentPostData = [
    mockMyProfileQuery(true, false),
    mockAbsentMyTeamPostsQuery
]

afterEach(cleanup)

describe('TeamBoardPostItem', () => {
    it('Should render without error', () => {
        render(
            <MockedProvider mocks={mocksCoach} addTypename={false}>
                <RecoilRoot>
                    <TeamBoardPost />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(screen.queryByText('Loading...')).toBeInTheDocument()
    })

    it('Should render error message', async () => {
        render(
            <MockedProvider mocks={mocksErrorPostData} addTypename={false}>
                <RecoilRoot>
                    <TeamBoardPost />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(screen.queryByText('データの取得に失敗しました。')).toBeInTheDocument()
    })

    it('Should render correct contents', async () => {
        render(
            <MockedProvider mocks={mocksCoach} addTypename={false}>
                <RecoilRoot>
                    <TeamBoardPost />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(screen.queryByText("Post's List")).toBeInTheDocument()
        expect(screen.queryAllByTestId('my-post').length).toEqual(5)
        expect(screen.queryByText('post1')).toBeInTheDocument()
        expect(screen.queryByTestId('1-post-created-at')).toHaveTextContent(moment.utc(moment().add(-1, 'days')).local().format("M月D日 H時m分"))
        expect(screen.queryAllByTestId('other-post').length).toEqual(5)
        expect(screen.queryByText('post6')).toBeInTheDocument()
        expect(screen.queryByTestId('6-post-created-at')).toHaveTextContent(moment.utc(moment().add(-6, 'days')).local().format("M月D日 H時m分"))
        expect(screen.queryByText("以前の10件の投稿")).toBeInTheDocument()
        expect(screen.queryByText("閉じる")).not.toBeInTheDocument()
    })

    it('Should fetch more post after fetch link', async　() => {
        render(
            <MockedProvider mocks={mocksCoach} addTypename={false}>
                <RecoilRoot>
                    <TeamBoardPost />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0))
        userEvent.click(screen.getByText('以前の10件の投稿'))
        await new Promise(resolve => setTimeout(resolve, 1000))
        expect(screen.queryByText('post11')).toBeInTheDocument()
        expect(screen.queryAllByTestId('my-post').length).toEqual(7)
        expect(screen.queryByText("閉じる")).toBeInTheDocument()
        expect(screen.queryByText("以前の10件の投稿")).not.toBeInTheDocument()
    })

    it('Should render absent message', async () => {
        render(
            <MockedProvider mocks={mocksAbsentPostData} addTypename={false}>
                <RecoilRoot>
                    <TeamBoardPost />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(screen.queryByText('投稿はありません。')).toBeInTheDocument()
    })

    describe('As Coach', () => {
        it('Should render correct contents', async () => {
            render(
                <MockedProvider mocks={mocksCoach} addTypename={false}>
                    <RecoilRoot>
                        <TeamBoardPost />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.queryByTestId('create-post-button')).toHaveTextContent('投稿')
            expect(screen.queryByTestId('1-post-delete-icon')).toBeInTheDocument()
            expect(screen.queryByTestId('6-post-delete-icon')).toBeInTheDocument()
        })
    })

    describe('As General', () => {
        it('Should render correct contents', async() => {
            render(
                <MockedProvider mocks={mocksGeneral} addTypename={false}>
                    <RecoilRoot>
                        <TeamBoardPost />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.queryByTestId('create-post-button')).toHaveTextContent('投稿')
            expect(screen.queryByTestId('1-post-delete-icon')).toBeInTheDocument()
            expect(screen.queryByTestId('6-post-delete-icon')).not.toBeInTheDocument()
        })
    })

    describe('As Guest', () => {
        it('Should render correct contents', async() => {
            render(
                <MockedProvider mocks={mocksGuest} addTypename={false}>
                    <RecoilRoot>
                        <TeamBoardPost />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(screen.queryByTestId('confirm-create-post-button')).not.toBeInTheDocument()
        })
    })
})