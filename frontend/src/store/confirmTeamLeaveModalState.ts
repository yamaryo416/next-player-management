import { atom } from 'recoil'

export const confirmTeamLeaveModalState = atom({
    key: "confirmTeamLeaveModalState",
    default: {
        id: "",
        nickname: "",
        isMyself: false,
        isModalOpen: false,
    }
});