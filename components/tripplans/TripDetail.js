import { Image, View } from "react-native"
import { Text } from "react-native-paper"
import MyStyles from "../../styles/MyStyles"

const TripDetail = ({instance}) => {
    return <>
        <Image source={{uri: instance.image}} style={MyStyles.pic_full}/>
        
        <View style={[MyStyles.description_area, MyStyles.padding_item]}>
            <Text>Nơi đến: {instance.destination}</Text>
            <Text>{instance.description.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')}</Text>
        </View>
    </>
}

export default TripDetail;