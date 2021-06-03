import { atom } from 'recoil'

export const confirmScheduleDeleteModalState = atom({
    key: "confirmScheduleDeleteModalState",
    default: {
        id: "",
        title: "",
        date: "",
        startDate: "",
        endDate: "",
        isModalOpen: false,
        isManySchedule: false,
    }
});