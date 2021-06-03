import '@testing-library/jest-dom/extend-expect'

import moment from "moment";
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecoilRoot } from 'recoil';

import { TODAY } from '../../../../../constants';
import { CalendarMenubar } from '../CalendarMenubar';

afterEach(cleanup)

describe('CalendarMenubar', () => {
    beforeEach(() => {
        render (
            <RecoilRoot>
                 <CalendarMenubar />
            </RecoilRoot>
        )
    })

    it('Should correct content', () => {
        expect(screen.queryByText(`${moment(TODAY).get('M')  + 1}月(今週)`)).toBeInTheDocument()
        screen.debug()
    })

    it('Should display next week after click next icon', () => {
        userEvent.click(screen.getByTestId('next-week'))
        expect(screen.queryByText(`${moment(TODAY).add(1, "w").get('M')  + 1}月(1週後)`)).toBeInTheDocument()
    })

    it('Should display last week after click back icon', () => {
        userEvent.click(screen.getByTestId('last-week'))
        expect(screen.queryByText(`${moment(TODAY).add(-1, "w").get('M')  + 1}月(1週前)`)).toBeInTheDocument()
    })

    it('Should display this week', () => {
        userEvent.click(screen.getByTestId('last-week'))
        userEvent.click(screen.getByTestId('this-week'))
        expect(screen.queryByText(`${moment(TODAY).get('M')  + 1}月(今週)`)).toBeInTheDocument()
        screen.debug()
    })
})

