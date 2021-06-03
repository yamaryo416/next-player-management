import { atom } from 'recoil'

import { FIRSTDATE, TODAY } from '../../constants';

export const calendarDateState = atom({
    key: "calendarDateState",
    default: {
        firstDate: FIRSTDATE,
        today: TODAY,
        todayDiff: 0
    }
});