import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                backgroundColor: "black",
                color: "white",
                fontSize: "10px"
            }
        }
    }
});

export default theme;