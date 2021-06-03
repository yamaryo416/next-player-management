import { atom } from 'recoil'

export const userAuthModalState = atom({
    key: "serAuthModalState",
    default: {
        isLogin: false,
        isModalOpen: false
    }
});