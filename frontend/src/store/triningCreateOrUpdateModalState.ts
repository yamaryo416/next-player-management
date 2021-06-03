import { atom } from 'recoil'

type StateType = {
    id: string;
    title: string;
    count: number | undefined;
    load: number | undefined;
    distance: number | undefined;
    description: string;
    iconNumber: number | undefined;
    isModalOpen: boolean;
    isCreate: boolean;

}

export const trainingCreateOrUpdateModalState = atom({
    key: "trainingCreateOrUpdateModalState",
    default: {
        id: '',
        title: '',
        count: undefined,
        load: undefined, 
        distance: undefined,
        description: '',
        iconNumber: undefined,
        isModalOpen: false,
        isCreate: false,
    }
});