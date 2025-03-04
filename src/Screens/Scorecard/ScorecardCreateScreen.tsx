import { SafeBottomContainer, useClient } from "../../Components/Container";
import { Text } from "react-native-paper";
import { useEffect } from "react";
import { handleToast, navigationProps, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Search";
import { useNavigation } from "@react-navigation/native";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";

interface ScorecardInterface {
    golf_id: string;
    user_id: string;
    user_info: userInfo;
    golf_info: golfInterface;
    tee: string;
}

const ScorecardCreateScreen = ({ route }: ScreenNavigationProps<ScorecardStackParams, "ScorecardCreateScreen">) => {
    const { golf_id } = route.params;
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();

    useEffect(() => {
        console.log(golf_id);
    }, [golf_id]);

    return (
        <SafeBottomContainer padding={undefined}>
            <Text>Score card</Text>
        </SafeBottomContainer>
    );
};

export default ScorecardCreateScreen;