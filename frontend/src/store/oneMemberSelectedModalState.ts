import { atom } from 'recoil'

type OneMemberSelectedModalType = {
    id: string;
    nickname: string;
    isCoach: boolean;
    isOpen: boolean;
}

export const oneMemberSelectedModalState = atom<OneMemberSelectedModalType>({
    key: "oneMemberSelectedModalState",
    default: {
        id: "",
        nickname: "",
        isCoach: true,
        isOpen: false
    }
});