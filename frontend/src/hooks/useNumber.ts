import { useCallback } from "react"

export const useNumber = () => {
    const undefinedNumber = useCallback((num: number | undefined) => {
        if (num === undefined) return 0
        else return num
    }, [])
    const zeroNumber = useCallback((num: number) => {
        if (num === 0) return undefined
        else return num
    }, [])

    return { undefinedNumber, zeroNumber }
}