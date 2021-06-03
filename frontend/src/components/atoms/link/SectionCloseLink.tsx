import { memo, VFC } from "react";
import { Link } from "@chakra-ui/layout";

type Props = {
    name: string;
    onClick: () => void;
}

export const SectionCloseLink: VFC<Props> = memo((props) => {
    const { name, onClick } = props

    return (
        <Link
            textAlign="center"
            float="right"
            pr={5}
            data-testid={`${name}-close-button`}
            onClick={onClick}
        >
            閉じる
        </Link>
    )
})