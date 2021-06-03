import { useCallback, useState } from "react"


export const useTrainingState = () => {
    const [isIconSelect, setIsIconSelect] = useState(false)

    const onChangeIsIconSelect = useCallback(() => setIsIconSelect(!isIconSelect), [isIconSelect])

    return ({ 
        isIconSelect,
        onChangeIsIconSelect,
    }) 
}