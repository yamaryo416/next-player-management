import { atom } from 'recoil'

export const teamAuthModalState = atom({
    key: "teamAuthModalState",
    default: {
        isJoin: false,
        isModalOpen: false
    }
});