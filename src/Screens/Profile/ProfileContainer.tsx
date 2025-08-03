import { ProfileProvider } from "../../Components/Container";
import { ProfileStackParams, ScreenNavigationProps } from '../../Services';
import ProfileScreen from "./ProfileScreen";

const ProfileContainer = ({ route }: ScreenNavigationProps<ProfileStackParams, "ProfileScreen">) => {

    const { nickname } = route.params;

    return (
        <ProfileProvider>
            <ProfileScreen nickname={nickname} />
        </ProfileProvider>
    )
};

export default ProfileContainer;