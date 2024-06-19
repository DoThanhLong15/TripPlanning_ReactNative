import { Image, ScrollView, TouchableOpacity, View} from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Text } from "react-native-paper";
import React, { useContext, useState } from 'react';
import { MyUserContext, MyDispatcherContext } from './../../configs/Contexts';
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfile = ({navigation}) => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);

    const data = [{
        label: `Username: ${user.username}`,
        icon: 'account',
        name: 'username'
    },{
        label: `Email: ${user.email}`,
        icon: 'email',
        name: 'email'
    },{
        label: `Điểm đánh giá: ${user.rating}`,
        icon: 'number',
        name: 'rating'
    },{
        label: `Số lượt đánh giá: ${user.ratingCount}`,
        icon: 'number',
        name: 'ratingCount'
    }]

    const goEdit = () => {
        navigation.navigate("EditUser")
    }

    const goJoinedTripPlan = () => {
        navigation.navigate("JoinedTripPlan")
    }

    const logout = async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('access-token');

        dispatch({
            "type": "logout",
            "payload": ""
        })

        navigation.navigate('TripPlan', {
            "toast": {
                "type": "success",
                "message": "Đăng xuất thành công!"
            }
        });
    }

    return (
        <View style={[MyStyles.pd_20, MyStyles.dp_flex]}> 
            <ScrollView style={MyStyles.w_100}>
                <Image src={user.avatar} style={[MyStyles.avatar_profile]}/>

                <Text style={[MyStyles.mg_10, MyStyles.text_center, MyStyles.title]}>{user.last_name} {user.first_name}</Text>

                {data.map(f => <Text key={f.name} style={[MyStyles.comment, MyStyles.mg_10, MyStyles.pd_20]}>{f.label}</Text>)}

                <TouchableOpacity style={MyStyles.mg_t_5} onPress={goJoinedTripPlan}>
                    <Text style={[MyStyles.button, MyStyles.padding_item, MyStyles.text_center]}>Hành trình đã tham gia</Text>
                </TouchableOpacity>

                <TouchableOpacity style={MyStyles.mg_t_5} onPress={goEdit}>
                    <Text style={[MyStyles.button, MyStyles.padding_item, MyStyles.text_center]}>Sửa trang cá nhân</Text>
                </TouchableOpacity>

                <TouchableOpacity style={MyStyles.mg_t_5} onPress={logout}>
                    <Text style={[MyStyles.descrip_title, MyStyles.padding_item, MyStyles.text_center]}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default UserProfile;