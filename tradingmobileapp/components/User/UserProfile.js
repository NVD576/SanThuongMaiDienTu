import { useContext } from "react";
import { Button } from "react-native-paper";
import { MyUserContext } from "../../configs/UserContexts";

const UserProfile = () => {
    const user = useContext(MyUserContext);

    return (
        <>
            <Text>{user.username}</Text>
            <Button mode="outlined">Đăng xuất</Button>
        </>
    );
}

export default UserProfile;