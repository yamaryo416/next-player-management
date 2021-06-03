import { useCallback } from "react"

export const useTrainingContents = () => {
    const showTrainingContents = useCallback(
        (title: string, count: number | null, load: number | null, distance: number | null ) => {
            let trainingContents = title
            if (count !== 0) {
                trainingContents  +=`/ ${count}回`
            }
            if (load !== 0) {
                trainingContents += `/ ${load}kg`
            }
            if (distance !== 0) {
                trainingContents += `/ ${distance}km`
            }
            return trainingContents
    }, []) 

    return { showTrainingContents }
}