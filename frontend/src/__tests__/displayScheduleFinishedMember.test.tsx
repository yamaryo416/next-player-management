import { getPage, initTestHelpers } from "next-page-tester";
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { render, screen, cleanup } from "@testing-library/react";
import moment from "moment";
import { mainPageHandlers } from "../mocks/handlers";
import userEvent from "@testing-library/user-event";
import { TODAY } from "../../constants";

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

describe('Display schedule finished member', () => {
    it('Should display schedule finished member after click finished member link', async () => {
        const { page } = await getPage({
            route: '/main'
        })
        render(page)
        expect(await screen.findByText('team')).toBeInTheDocument()
        userEvent.click(screen.queryByTestId('1-finished-member-link'))
        expect(await screen.findByText('Schedule Finished Member'))
        expect(await screen.findByTestId('selected-schedule-finished-title')).toHaveTextContent('トレーニング1')
        expect(await screen.findByTestId('selected-schedule-finished-date')).toHaveTextContent(moment(TODAY).format('YYYY年M月D日'))
        expect(screen.queryAllByTestId('finished-schedule-member-nickname').length).toBe(1)
        expect(screen.queryAllByTestId('finished-schedule-member-nickname')[0]).toHaveTextContent('coach user')
        expect(screen.queryAllByTestId('not-finished-schedule-member-nickname').length).toBe(2)
        expect(screen.queryAllByTestId('not-finished-schedule-member-nickname')[0]).toHaveTextContent('user2')
        expect(screen.queryAllByTestId('not-finished-schedule-member-nickname')[1]).toHaveTextContent('user3')
    })
})