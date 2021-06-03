import { atom } from 'recoil'

export type ScheduleFinishedModalStateType = {
    id: string;
    title: string;
    date: string;
    isOpen: "section" | "modal" | false;
}

export const scheduleFinishedModalState = atom<ScheduleFinishedModalStateType>({
    key: "scheduleFinishedModalState",
    default: {
        id: "",
        title: "",
        date: "",
        isOpen: false
    }
});