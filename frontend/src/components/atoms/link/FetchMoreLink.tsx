import { memo, VFC } from "react";
import { Link } from "@chakra-ui/layout";

type Props = {
    name: string;
    text: string;
    onClick: () => void;
}

export const FetchMoreLink: VFC<Props> = memo((props) => {
    const { name, text, onClick } = props;

    return (
        <Link
            color="orange"
            onClick={onClick}
            data-testid={name + '-fetch-more-button'}
        >
            {text}
        </Link>
    )
})