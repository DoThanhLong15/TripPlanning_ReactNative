import { Image, Text, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import moment from 'moment';
import { useNavigation } from "@react-navigation/native";

const Item = ({instance}) => {
    return (
        <>
            <List.Item key={instance.id} title={() => 
                <Text style={MyStyles.title}>
                {instance.user.last_name} {instance.user.first_name}
                </Text>
            }
            description={instance.created_date?moment(instance.created_date).fromNow():""}
            left={() => 
            <Image style={MyStyles.avatar} source={{uri: instance.user.avatar}} />} />
            <View style={[MyStyles.padding_item, MyStyles.description_area]}>
                <Text style={[MyStyles.padding_item, MyStyles.descrip_title]}>{instance.title}</Text>
                <View style={MyStyles.padding_item}>
                    <Text style={MyStyles.description}>{instance.description.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')}</Text>
                    <Text>Nơi bắt đầu: {instance.startLocation}</Text>
                    <Text>Khởi hành: {moment(instance.startTime).format('llll')}</Text>
                    <Text>Kết thúc: {moment(instance.endTime).format('llll')}</Text>
                    <Text>Chi phí dự kiến: {instance.expectCost} VND</Text>
                </View>
            </View>
            <Text style={[MyStyles.comment, MyStyles.padding_item]}>{instance.comment_count} Bình luận</Text>
        </>
    );
}

export default Item;