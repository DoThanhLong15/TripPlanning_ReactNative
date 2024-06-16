import { Text } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";

const EmptyList = ({list, type}) => {
    return <>
        {list.length == 0 && <Text style={[MyStyles.text_center, MyStyles.padding_item]}>Không có {type} nào!</Text>}
    </>
}

export default EmptyList;