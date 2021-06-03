import '@testing-library/jest-dom/extend-expect'

import { RecoilRoot } from 'recoil';
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { OneTeamCalendarSection } from '../OneTeamCalendarSection';
import { mockSchedules } from '../../../mocks/mockScheduleData';

afterEach(cleanup)

describe('OneTeamCalendarSection', () => {
    it('Should display next week schedule after next week icon', () => {
        render(
            <RecoilRoot>
                <OneTeamCalendarSection schedules={mockSchedules} />
            </RecoilRoot>
        )
        expect(screen.queryAllByTestId('white-training-icon-1').length).toEqual(2)
        expect(screen.queryByTestId('white-training-icon-4')).not.toBeInTheDocument()
        userEvent.click(screen.getByTestId('next-week'))
        expect(screen.queryAllByTestId('white-training-icon-1').length).toEqual(1)
        expect(screen.queryByTestId('white-training-icon-4')).toBeInTheDocument()
        userEvent.click(screen.getByTestId('this-week'))
        expect(screen.queryAllByTestId('white-training-icon-1').length).toEqual(2)
        expect(screen.queryByTestId('white-training-icon-4')).not.toBeInTheDocument()
    })
})