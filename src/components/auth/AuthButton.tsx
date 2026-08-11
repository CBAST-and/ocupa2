import { Pressable, Text } from "react-native";
import { authStyles } from "../../styles/authStyles";

type AuthButtonProps = {
    title: string;
    onPress: () => void;
};

export default function AuthButton({
    title,
    onPress,
}: AuthButtonProps) {
    return (
        <Pressable
            style={authStyles.button}
            onPress={onPress}
        >
            <Text style={authStyles.buttonText}>
                {title}
            </Text>
        </Pressable>
    );
}