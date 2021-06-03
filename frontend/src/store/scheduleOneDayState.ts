import { atom } from 'recoil'

import { TODAY } from '../../constants';

export const scheduleOneDayState = atom({
    key: "scheduleOneDayState",
    default: TODAY,
});