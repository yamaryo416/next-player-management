import '@testing-library/jest-dom/extend-expect'

import moment from "moment";
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecoilRoot } from 'recoil';

import { TODAY } from '../../../../../constants';
import { CalendarDetailMenubar } from '../CalendarDetailMenubar';

afterEach(cleanup)

describe('CalendarDetailMenubar', () => {
    beforeEach(() => {
        render (
            <RecoilRoot>
                 <CalendarDetailMenubar />
            </RecoilRoot>
        )
    })

    it('Should correct content with icon', () => {
        expect(screen.queryByText(`Today's Schedules`)).toBeInTheDocument()
    })

    it('Should display next date after click next icon', () => {
        userEvent.click(screen.getByTestId('next-date'))
        expect(screen.queryByText(`${moment(TODAY).add(1, "days").format('M/D')}'s Schedules`)).toBeInTheDocument()
    })

    it('Should display previous date after click next icon', () => {
        userEvent.click(screen.getByTestId('previous-date'))
        expect(screen.queryByText(`${moment(TODAY).add(-1, "days").format('M/D')}'s Schedules`)).toBeInTheDocument()
    })
})