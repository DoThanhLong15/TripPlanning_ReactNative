import { Image, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import GoBackButton from "../utils/GoBackButton";
import Title from "../utils/Title";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, HelperText, List, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints } from "../../configs/APIs";
import { ErrorMessageShow, ToastShow } from "../utils/Utils";
import EmptyList from "../utils/EmptyList";
import moment from "moment";

const JoinedTripPlan = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({visible: false});
    const [rating, setRating] = useState(0);
    const [tripplanList, setTripPlanList] = useState([])
    const [ratingShow, setRatingShow] = useState(false)
    const textInputRef = useRef(null);


    const updataStateRating = (value) => {
        if (value >= 0 && value <= 10) {
            setRating(value);
            setError({visible: false})
        } else {
            setError(ErrorMessageShow("Vui lòng nhập giá trị từ 0 đến 10"))
        }
    }

    const loadJoinedTripPlan = async () => {
        try {
            setLoading(true);

            let token = await AsyncStorage.getItem("access-token");
            let res = await APIs.get(`${endpoints["users"]}/joined-tripplan/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setTripPlanList(res.data)

        } catch(ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const showRatingInput = () => {
        setRatingShow(true)
    }

    const hideRatingInput = () => {
        setRatingShow(false)
        setRating(0)
    }

    const postRating = async (tripplan_id, owner_id) => {
        try {
            let token = await AsyncStorage.getItem("access-token");
            let form = new FormData()
            form.append("tripplan_id", tripplan_id)
            form.append("user_rating", rating)
            let res = await APIs.post(`${endpoints['users']}/${owner_id}/rating/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            setTripPlanList(current => {
                current.forEach(f => {
                    if(f.tripplan.id == tripplan_id)
                        f.rating = rating
                })

                return current
            })
            ToastShow("Đánh giá hành trình thành công!", "success")
            hideRatingInput()

        } catch(ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadJoinedTripPlan()
    }, [])

    useEffect(() => {
        if (ratingShow && textInputRef.current) {
          textInputRef.current.focus();
        }
    }, [ratingShow]);


    return (
        <View style={MyStyles.margin}>
            <GoBackButton title="UserProfile" navigation={navigation} buttonText="Trở về"/>

            <Title title="Danh sách hành trình đã tham gia"/>

            {loading && <ActivityIndicator/>}

            <EmptyList list={tripplanList} type="hành trình"/>
    
            {tripplanList.map(f => 
                <View key={f.id} 
                    style={[MyStyles.item_area, MyStyles.padding_item, MyStyles.margin_bt]}>
                    <List.Item key={f.tripplan.id} title={() => 
                        <Text style={MyStyles.title}>
                        {f.tripplan.user.last_name} {f.tripplan.user.first_name}
                        </Text>}
                        description={f.tripplan.created_date?moment(f.tripplan.created_date).fromNow():""}
                        left={() => 
                        <Image style={MyStyles.avatar} source={{uri: f.tripplan.user.avatar}} />} />

                    <Text style={[MyStyles.padding_item, MyStyles.descrip_title]}>
                        {f.tripplan.title}
                    </Text>
                    <Text style={MyStyles.description}>
                        {f.tripplan.description.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')}
                    </Text>

                    <Text style={MyStyles.margin}>
                        Điểm đánh giá: {f.rating == 0 ? "Chưa đánh giá": f.rating}
                    </Text>

                    {f.rating == 0 && <Button style={[MyStyles.comment]}
                        onPress={showRatingInput}>
                        Đánh giá
                    </Button>}

                    {ratingShow && <View style={[MyStyles.flex_row, MyStyles.margin]}>
                        <TextInput style={[MyStyles.w_70]}
                            onChangeText={t => updataStateRating(parseFloat(t))}
                            value={rating.toString()}
                            ref={textInputRef}/>

                        <TouchableOpacity 
                            onPress={() => postRating(f.tripplan.id, f.tripplan.user.id)}>
                            <Text style={[MyStyles.comment, MyStyles.pd_10]}>Ok</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={hideRatingInput}>
                            <Text style={[MyStyles.comment, MyStyles.pd_10]}>Hủy</Text>
                        </TouchableOpacity>
                    </View>}

                    <HelperText type="error" visible={error.visible}>
                        {error.message}
                    </HelperText>
                   
                </View>)}
        </View>
    );
}

export default JoinedTripPlan;