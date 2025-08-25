import ProfileScreen from "./ProfileScreen";
import { ProfileProvider } from "../../Components/Container";
import { ProfileStackParams, ScreenNavigationProps } from '../../Services';

const ProfileContainer = ({ route }: ScreenNavigationProps<ProfileStackParams, "ProfileScreen">) => {

    const { nickname } = route.params;

    return (
        <ProfileProvider>
            <ProfileScreen nickname={nickname} />
        </ProfileProvider>
    )
};

export default ProfileContainer;