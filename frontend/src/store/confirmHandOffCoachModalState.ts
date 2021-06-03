import { atom } from 'recoil'

export const confirmHandOffCoachModalState = atom({
    key: "confirmHandOffCoachModalState",
    default: {
        id: "",
        nickname: "",
        isModalOpen: false,
    }
});