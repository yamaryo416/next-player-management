import { memo, VFC } from "react";
import { Img } from "@chakra-ui/image";

type Props = {
    iconNumber: number | null;
    color: string;
    size: string;
}

export const TrainingIcon: VFC<Props> = memo((props) => {
    const { iconNumber, color, size } = props

    switch (color) {
        case "black":
            switch (iconNumber) {
                case 1:
                    return <Img src='/icon/black-barbell.png' boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-1' />
                case 2:
                    return <Img src='/icon/black-barbell-squat.png' boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-2' />
                case 3:
                    return <Img src="/icon/black-running.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-3' />
                case 4:
                    return <Img src="/icon/black-squat.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-4' />
                case 5:
                    return <Img src="/icon/black-dumbell.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-5' />
                case 6:
                    return <Img src="/icon/black-plunk.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-6' />
                case 7:
                    return <Img src="/icon/black-pull-up.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-7' />
                case 8:
                    return <Img src="/icon/black-sit-up.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-8' />
                case 9:
                    return <Img src="/icon/black-forward-bending.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-9' />
                case 10:
                    return <Img src="/icon/black-swim.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-10' />
                case 11:
                    return <Img src="/icon/black-cycling.png" boxSize={{ base: "50px", md: size }} data-testid='black-training-icon-11' /> 
                default:
                    return null
            }
        case "white":
            switch (iconNumber) {
                case 1:
                    return <Img src="/icon/white-barbell.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-1' />
                case 2:
                    return <Img src="/icon/white-barbell-squat.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-2' />
                case 3:
                    return <Img src="/icon/white-running.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-3' />
                case 4:
                    return <Img src="/icon/white-squat.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-4' />
                case 5:
                    return <Img src="/icon/white-dumbell.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-5' />
                case 6:
                    return <Img src="/icon/white-plunk.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-6' />
                case 7:
                    return <Img src="/icon/white-pull-up.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-7' />
                case 8:
                    return <Img src="/icon/white-sit-up.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-8' />
                case 9:
                    return <Img src="/icon/white-forward-bending.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-9' />
                case 10:
                    return <Img src="/icon/white-swim.png"boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-10' />
                case 11:
                    return <Img src="/icon/white-cycling.png" boxSize={{ base: "30px", md: size }} data-testid='white-training-icon-11' /> 
                default:
                    return <Img src="/icon/no-icon.png" boxSize={{ base: "30px", md: size }} data-testid='no-icon' />
            }
        default:
            return <Img src="/icon/no-icon.png" boxSize={{ base: "30px", md: size }} data-testid='no-icon' />
     }
})