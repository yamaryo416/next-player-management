import { atom } from 'recoil'

type StateType = {
    title: string;
    count: number | undefined;
    load: number | undefined;
    distance: number | undefined;
    description: string;
    iconNumber: number | undefined;
    isOpen: boolean;
}

export const trainingDetailModalState = atom<StateType>({
    key: "trainingDetailModalState",
    default: {
        title: '',
        count: undefined,
        load: undefined,
        distance: undefined,
        description: '',
        iconNumber: undefined,
        isOpen: false
    }
});