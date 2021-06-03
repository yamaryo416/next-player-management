import { atom } from 'recoil'

type StateType = {
    id: string;
    title: string;
    count: number | undefined;
    load: number | undefined;
    distance: number | undefined;
    description: string;
    isOpen: boolean;
}

export const confirmTrainingDeleteState = atom<StateType>({
    key: "confirmTrainingDeleteState",
    default: {
        id: '',
        title: '',
        count: undefined,
        load: undefined,
        distance: undefined,
        description: '',
        isOpen: false
    },
});