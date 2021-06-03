import { getPage, initTestHelpers } from "next-page-tester";
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { teamsPageHandlers } from "../../mocks/handlers";
import { render, screen, cleanup } from "@testing-library/react";
import moment from "moment";
import { TODAY } from "../../../constants";

initTestHelpers()

const server = setupServer(...teamsPageHandlers)

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

describe('Team page', () => {
    it('Should render correct contents', async () => {
        const { page } = await getPage({
            route: '/teams'
        })
        render(page)
        expect(await screen.findByText('team')).toBeInTheDocument()
        expect(screen.queryByTestId('my-nickname')).toHaveTextContent('coach user')
        expect(screen.queryByText('Other Teams Page')).toBeInTheDocument()
        expect(await screen.findByTestId('1-team-name')).toHaveTextContent('team1')
        expect(await screen.findByTestId('1-team-coach')).toHaveTextContent('コーチ: coach1')
        expect(await screen.findByTestId('1-team-join-count')).toHaveTextContent('チーム人数: 1人')
        expect(await screen.findByTestId('2-team-name')).toHaveTextContent('team2')
        expect(await screen.findByTestId('2-team-coach')).toHaveTextContent('コーチ: coach2')
        expect(await screen.findByTestId('2-team-join-count')).toHaveTextContent('チーム人数: 2人')
        expect(await screen.findByTestId('3-team-name')).toHaveTextContent('team3')
        expect(await screen.findByTestId('3-team-coach')).toHaveTextContent('コーチ: coach3')
        expect(await screen.findByTestId('3-team-join-count')).toHaveTextContent('チーム人数: 3人')
    })
})