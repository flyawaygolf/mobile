import { SafeBottomContainer } from "../../Components/Container";
import { Text } from "react-native-paper";
import { useEffect } from "react";
import { ScorecardStackParams, ScreenNavigationProps } from "../../Services";


const ScorecardCreateScreen = ({ route }: ScreenNavigationProps<ScorecardStackParams, "ScorecardCreateScreen">) => {
    const { golf_id } = route.params;
    useEffect(() => {
        console.log(golf_id);
    }, [golf_id]);

    return (
        <SafeBottomContainer>
            <Text>Score card</Text>
        </SafeBottomContainer>
    );
};

export default ScorecardCreateScreen;