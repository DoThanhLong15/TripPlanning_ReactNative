import { Text } from "react-native-paper"
import MyStyles from "../../styles/MyStyles"

const Title = ({title}) => {
    return (
        <Text style={[MyStyles.title, MyStyles.pd_20]}>{title}</Text>
    )
}

export default Title;