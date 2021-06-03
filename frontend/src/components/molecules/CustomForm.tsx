import { ChangeEvent, FocusEvent, memo, VFC } from "react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"

type Props = {
    name: string;
    type: string;
    handleChange: { 
        (e: ChangeEvent<any>): void;
        <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any> ? void : (e: string | ChangeEvent<any>) => void; 
    }
    handleBlur: { 
        (e: FocusEvent<any>): void;
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void; }
    value: string;
    placeholder: string;
    children: string | null;
}

export const CustomForm: VFC<Props> =memo((props) => {
    const { name, type, handleChange, handleBlur, value, placeholder  , children } = props
    return (
        <FormControl>
            <FormLabel
                fontSize="20px"
            >{children}</FormLabel>
            <Input 
                name={name}
                type={type}
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
                borderColor="gray.400"
                borderRadius="1000px"
                placeholder={placeholder}
                data-testid={name + '-form'}
            />
        </FormControl>
    )
})

