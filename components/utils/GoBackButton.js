import { Button } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";

const GoBackButton = ({navigation, title, buttonText, dataChange}) => {

    const goBack = () => {
        navigation.navigate(title, dataChange)
    }

    return (
        <Button icon="keyboard-backspace" style={MyStyles.fixed_button} 
            onPress={goBack}>{buttonText}
        </Button>
    );
}

export default GoBackButton;