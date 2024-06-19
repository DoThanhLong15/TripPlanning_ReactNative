import { Image, View } from "react-native"
import { Button, Text } from "react-native-paper"
import MyStyles from "../../styles/MyStyles"
import moment from "moment"


const TripDetail = ({instance, user, owner_id, buttonHandle}) => {
    return <>
        {instance.image && <Image source={{uri: instance.image}} style={MyStyles.pic_full}/>}
        
        <View style={[MyStyles.description_area, MyStyles.padding_item]}>
            <Text>Nơi đến: {instance.destination}</Text>

            <Text>{instance.description.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')}</Text>
            
            <Text>Thời gian di chuyển: 
                {moment(instance.travelTime, "HH:mm:ss").format(" H giờ m ")}phút</Text>
        </View>

        {user?.id === owner_id && 
        <View style={[MyStyles.flex_row, MyStyles.w_50]}>
            <Button style={[MyStyles.w_45]}
                onPress={() => {buttonHandle.edit(instance)}}>Sửa
            </Button>
            <Button style={[MyStyles.w_45]}
                onPress={() => {buttonHandle.delete(instance.id)}}>Xóa
            </Button>
        </View>}
    </>
}

export default TripDetail;