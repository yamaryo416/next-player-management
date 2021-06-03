import { atom } from 'recoil'

export const confirmPostDeleteModalState = atom({
    key: "confirmPostDeleteModalState",
    default: {
        id: "",
        text: "",
        isModalOpen: false,
    }
});