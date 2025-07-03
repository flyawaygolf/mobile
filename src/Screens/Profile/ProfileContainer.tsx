import { ProfileProvider, SafeBottomContainer } from "../../Components/Container";
import { ProfileStackParams, ScreenNavigationProps } from '../../Services';
import ProfileScreen from "./ProfileScreen";

const ProfileContainer = ({ route }: ScreenNavigationProps<ProfileStackParams, "ProfileScreen">) => {

    const { nickname } = route.params;

    return (
        <ProfileProvider>
            <SafeBottomContainer padding={{
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }}>
                <ProfileScreen nickname={nickname} />
            </SafeBottomContainer>
        </ProfileProvider>
    )
};

export default ProfileContainer;