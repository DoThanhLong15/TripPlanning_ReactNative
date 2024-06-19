import { Button, Checkbox, List, Text, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import moment from "moment";
import { Image, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { MyUserContext } from "../../configs/Contexts";

const Comment = ({instance, tripplanOwnerId, userJoinHandle, buttonHandle, commentShow}) => {
    const currentUser = useContext(MyUserContext)
    const [isJoin, setIsJoin] = useState(instance.is_join);
    const [commentEdit, setCommentEdit] = useState({
        visible: false
    })
    const textInputRef = useRef(null);

    const showCommentEdit = (content) => {
        commentShow(false)
        setCommentEdit({
            visible: true,
            value: content
        })
    }

    const hideCommentEdit = () => {
        commentShow(true)
        setCommentEdit({
            visible: false
        })
    }

    const confirmCommentEdit = async () => {
        await buttonHandle.edit(instance.id, commentEdit.value)

        hideCommentEdit()
    }

    const handleJoinToggle = async () => {
        if(isJoin) {
            await userJoinHandle.remove(instance.user.id)
        }
        else {
            await userJoinHandle.add(instance.user.id)
        }
        setIsJoin(!isJoin);
    };

    const updateCommentEdit = (value) => {
        setCommentEdit({
           ...commentEdit,
            value: value
        })
    }

    const showTimePost = () => {
        let time = instance.updated_date ? instance.updated_date : instance.created_date

        return <Text>{moment(time).fromNow()}</Text>
    }

    useEffect(() => {
        if (commentEdit.visible && textInputRef.current) {
          textInputRef.current.focus();
        }
      }, [commentEdit.visible]);

    useEffect(() => {
        setIsJoin(instance.is_join);
    }, [instance.is_join]);

    return <>
        <List.Item style={MyStyles.padding_item} 
            title={() => 
                <Text style={MyStyles.title}>
                    {instance.user.last_name} {instance.user.first_name}
                </Text>}
            description={() => showTimePost()}
            left={() => 
                <Image style={MyStyles.comment_thumbnail} source={{uri: instance.user?.avatar}}/>} 
            right={() => tripplanOwnerId != instance.user.id && currentUser ? 
                <Checkbox.Item status={isJoin ? "checked": "unchecked"}/> : null}
                    onPress={handleJoinToggle}
                    disabled={tripplanOwnerId != currentUser?.id}/>

        <Text style={[MyStyles.padding_item]}>{instance.content}</Text>
        

        {currentUser?.id === instance.user.id && 
        <View style={[MyStyles.flex_row, MyStyles.w_50]}>
            <Button style={[MyStyles.w_45, MyStyles.instance]}
                onPress={() => showCommentEdit(instance.content)}>Sửa
            </Button>
            <Button style={[MyStyles.w_45, MyStyles.instance]}
                onPress={() => buttonHandle.delete(instance.id)}>Xóa
            </Button>
        </View>}


        {commentEdit.visible && <View style={MyStyles.flex_row}>
            <TextInput style={[MyStyles.w_70]}
                value={commentEdit.value}
                ref={textInputRef}
                onChangeText={value => updateCommentEdit(value)}/>

            <TouchableOpacity onPress={confirmCommentEdit}>
                <Text style={[MyStyles.comment, MyStyles.pd_10]}>Ok</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={hideCommentEdit}>
                <Text style={[MyStyles.comment, MyStyles.pd_10]}>Hủy</Text>
            </TouchableOpacity>
        </View>}
    </>
}

export default Comment;