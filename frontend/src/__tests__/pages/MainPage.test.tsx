import { getPage, initTestHelpers } from "next-page-tester";
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { mainPageHandlers } from "../../mocks/handlers";
import { render, screen, cleanup } from "@testing-library/react";
import moment from "moment";
import { TODAY } from "../../../constants";

initTestHelpers()

const server = setupServer(...mainPageHandlers)

beforeAll(() => {
    server.listen()
})
afterEach(() => {
    server.resetHandlers()
    cleanup()
})
afterAll(() => {
    server.close()
})

describe('Main page', () => {
    it('Should render correct contents', async () => {
        const { page } = await getPage({
            route: '/main'
        })
        render(page)
        expect(await screen.findByText('team')).toBeInTheDocument()
        expect(screen.queryByTestId('my-nickname')).toHaveTextContent('coach user')
        expect(screen.queryByText('My Page')).toBeInTheDocument()
        expect(screen.queryByText("Today's Schedules")).toBeInTheDocument()
        expect(screen.queryByTestId('1-schedule-training')).toHaveTextContent('トレーニング1/ 10回/ 20kg/ 30km')
        expect(screen.queryByTestId('1-check-box-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('1-check-box-outline-icon')).not.toBeInTheDocument()
        expect(screen.queryByTestId('1-finished-count')).toHaveTextContent('1/2人実施')
        expect(screen.queryByTestId('2-schedule-training')).toHaveTextContent('アイコンなしトレーニング2')
        expect(screen.queryByTestId('2-check-box-icon')).not.toBeInTheDocument()
        expect(screen.queryByTestId('2-check-box-outline-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('2-finished-count')).toHaveTextContent('0/2人実施')
        expect(await screen.findByTestId('1-schedule-item')).toBeInTheDocument()
        expect(screen.queryByTestId('1-schedule-item').getElementsByTagName('img')[0]).toHaveAttribute('src', '/icon/white-barbell.png')
        expect(screen.queryByTestId('2-schedule-item').getElementsByTagName('p')[0]).toHaveTextContent('アイコンなしトレーニング2')
        expect(screen.queryByText("Training List")).toBeInTheDocument()
        expect(screen.queryByTestId('1-training-icon').getElementsByTagName('img')[0]).toHaveAttribute('src', '/icon/white-barbell.png')
        expect(screen.queryByTestId('1-training-title')).toHaveTextContent('トレーニング1')
        expect(screen.queryByTestId('1-training-edit-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('1-training-delete-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('10-training-icon').getElementsByTagName('img')[0]).toHaveAttribute('src', '/icon/white-swim.png')
        expect(screen.queryByTestId('10-training-title')).toHaveTextContent('トレーニング10')
        expect(screen.queryByTestId('11-training-title')).not.toBeInTheDocument()
        expect(screen.queryByTestId('training-fetch-more-button')).toBeInTheDocument()
        expect(screen.queryByText("team's Board")).toBeInTheDocument()
        expect(screen.queryByTestId('team-coach-name')).toHaveTextContent('coach user')
        expect(screen.queryByTestId('team-join-count')).toHaveTextContent('2人')
        expect(screen.queryByTestId('team-introduction')).toHaveTextContent('記載はありません。')
        expect(screen.queryByText("Post's List")).toBeInTheDocument()
        expect(screen.queryAllByTestId('my-post').length).toEqual(5)
        expect(screen.queryByText('post1')).toBeInTheDocument()
        expect(screen.queryByTestId('1-post-created-at')).toHaveTextContent(moment.utc(moment().add(-1, 'days')).local().format("M月D日 H時m分"))
        expect(screen.queryAllByTestId('other-post').length).toEqual(5)
        expect(screen.queryByText('post10')).toBeInTheDocument()
        expect(screen.queryByTestId('10-post-created-at')).toHaveTextContent(moment.utc(moment().add(-10, 'days')).local().format("M月D日 H時m分"))
        expect(screen.queryByText('post11')).not.toBeInTheDocument()
        expect(screen.queryByTestId('post-fetch-more-button')).toBeInTheDocument()
    })
})
