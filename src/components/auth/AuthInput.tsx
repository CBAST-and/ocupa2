import { TextInput, TextInputProps } from "react-native";
import { authStyles } from "../../styles/authStyles";

type AuthInputProps = TextInputProps & {
    placeholder: string;
};

export default function AuthInput({
    placeholder,
    ...props
}: AuthInputProps) {
    return (
        <TextInput
            style={authStyles.input}
            placeholder={placeholder}
            {...props}
        />
    );
}