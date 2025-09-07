export type SelectBoxProps={
    placeholder?: string,
    error?: boolean,
    errorMessage?: string,
    onValueChange: (value: string) => void,
    className?: string;
    value: string,
    options: Array <{
        value: string,
        label: string,
        className?: string  
    }>,
    testId?: string;
    id: string;

}