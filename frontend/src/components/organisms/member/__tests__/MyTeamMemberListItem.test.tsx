import '@testing-library/jest-dom/extend-expect'

import { RecoilRoot } from 'recoil';
import { render, screen, cleanup } from '@testing-library/react'

import { MyTeamMemberListItem } from '../MyTeamMemberListItem';
import { mockMember } from '../../../../mocks/mockProfileData';

afterEach(cleanup)

describe('MyTeamMemberListItem', () => {
    it('Should correct content', () => {
        render(
            <RecoilRoot>
                <MyTeamMemberListItem member={mockMember} />
            </RecoilRoot>
        )
        expect(screen.queryByTestId('1-member-nickname')).toHaveTextContent('coach user')
        expect(screen.queryByTestId('1-member-join-date')).toHaveTextContent('2021年1月2日')
        expect(screen.queryByTestId('1-member-join-time')).toHaveTextContent('1時23分')
        expect(screen.queryByTestId('1-member-finished-schedule-count')).toHaveTextContent('12回')
    })
})