import { getPage, initTestHelpers } from "next-page-tester";
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { myTeamMemberPageHandler } from "../../mocks/handlers";
import { render, screen, cleanup } from "@testing-library/react";
import moment from "moment";
import { TODAY } from "../../../constants";

initTestHelpers()

const server = setupServer(...myTeamMemberPageHandler)

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

describe('My Team Member Page', () => {
    it('Should render correct contents', async () => {
        const { page } = await getPage({
            route: '/my-team-member'
        })
        render(page)
        expect(await screen.findByText('team')).toBeInTheDocument()
        expect(screen.queryByText('My Team Member Page')).toBeInTheDocument()
        expect(screen.queryByText('My Team Member List')).toBeInTheDocument()
        expect(await screen.findByTestId('1-member-nickname')).toHaveTextContent('coach user')
        expect(await screen.findByTestId('2-member-nickname')).toHaveTextContent('user2')
        expect(await screen.findByTestId('3-member-nickname')).toHaveTextContent('user3')
        expect(screen.queryByText('Member Detail')).toBeInTheDocument()
        expect(await screen.findByTestId('one-member-detail-nickname')).toHaveTextContent('coach user')
        expect(await screen.findByTestId('1-training-contents')).toHaveTextContent('トレーニング1/ 10回/ 20kg/ 30km')
        expect(await screen.findByTestId('1-finished-count')).toHaveTextContent('1回')       
        expect(await screen.findByTestId('11-training-contents')).toHaveTextContent('トレーニング11/ 10回/ 20kg/ 30km')
        expect(await screen.findByTestId('11-finished-count')).toHaveTextContent('0回')    
    })
})
