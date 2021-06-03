import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'

import { mockScheduleWithoutFinishedMember, mockScheduleWithoutIcon } from '../../../../mocks/mockScheduleData';
import { CalendarDetailContents } from '../CalendarDetailContents';

afterEach(cleanup)

describe('CalendarDetailContents', () => {
    it('Should correct content with icon', () => {
        render(
            <CalendarDetailContents 
                node={mockScheduleWithoutFinishedMember('1')}
            />
        )
        expect(screen.queryByText('トレーニング1/ 10回/ 20kg/ 30km')).toBeInTheDocument()
        expect(screen.queryByRole('img')).toHaveAttribute('src', '/icon/white-barbell.png')
    })

    it('Should correct content without icon', () => {
        render(
            <CalendarDetailContents 
                node={mockScheduleWithoutIcon('1')}
            />
        )
        expect(screen.queryByText('アイコンなしトレーニング1')).toBeInTheDocument()
        expect(screen.queryByRole('img')).toHaveAttribute('src', '/icon/no-icon.png')
    })
})