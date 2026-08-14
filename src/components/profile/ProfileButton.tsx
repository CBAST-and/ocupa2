import { ActivityIndicator, Pressable, Text } from "react-native";
import { profileStyles } from "@/styles/profileStyles";

type ProfileButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

export default function ProfileButton({
    title,
    onPress,
    disabled = false,
    loading = false,
}: ProfileButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            style={[profileStyles.button, isDisabled && profileStyles.buttonDisabled]}
            onPress={onPress}
            disabled={isDisabled}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={profileStyles.buttonText}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}
