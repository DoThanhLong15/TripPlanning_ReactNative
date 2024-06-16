import { Checkbox, List, Text } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import moment from "moment";
import { Image } from "react-native";
import { useEffect, useState } from "react";

const Comment = ({instance, tripplanOwnerId, currentUser, userJoinHandle}) => {
    const [isJoin, setIsJoin] = useState(instance.is_join);

   useEffect(() => {
        setIsJoin(instance.is_join);
    }, [instance.is_join]);

    const handleJoinToggle = async () => {
        if(isJoin) {
            await userJoinHandle.remove(instance.user.id)
        }
        else {
            await userJoinHandle.add(instance.user.id)
        }
        setIsJoin(!isJoin);
    };

    return <>
        <List.Item style={MyStyles.padding_item} 
            title={() => 
                <Text style={MyStyles.title}>
                    {instance.user.last_name} {instance.user.first_name}
                </Text>}
            description={instance.created_date?moment(instance.created_date).fromNow():""}
            left={() => 
                <Image style={MyStyles.comment_thumbnail} source={{uri: instance.user.avatar}}/>} 
            right={() => tripplanOwnerId != instance.user.id && currentUser ? 
                <Checkbox.Item status={isJoin ? "checked": "unchecked"}/> : null}
                    onPress={handleJoinToggle}
                    disabled={tripplanOwnerId != currentUser?.id}/>

        <Text style={MyStyles.padding_item}>{instance.content}</Text>
    </>
}

export default Comment;