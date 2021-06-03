import { atom } from 'recoil'

type TrainingContentsStateType = {
    id: string;
    title: string;
    count: number | undefined;
    load: number | undefined;
    distance: number | undefined;
    description: string;
    iconNumber: number | undefined;
}

export const trainingContentsState = atom<TrainingContentsStateType>({
    key: "trainingContentsState",
    default: {
        id: "",
        title: "",
        count: undefined,
        load: undefined,
        distance: undefined,
        description: "",
        iconNumber: undefined,
    }
});