import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import GoBackButton from "../utils/GoBackButton";
import { useEffect, useState } from "react";
import { DatetimeFields, TextFields } from "./TripPlanFields";
import { ChangeDataToForm, ErrorMessageHide, ErrorMessageShow } from "../utils/Utils";
import Title from "../utils/Title";
import TripPlanForm from "./TripPlanForm";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints } from "../../configs/APIs";

const EditTripPlan = ({navigation, route}) => {
    const currentTripPlan = route.params.tripplan;
    const [newTripPlan, setNewTripPlan] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({visible: false});

    const fields = TextFields;
    const datetimeFields = DatetimeFields;

    const checkNumValid = (number) => {
        if(Number.isNaN(number)){
            setError(ErrorMessageShow("Vui lòng nhập số!"))
            return false;
        }

        setError(ErrorMessageHide())

        return true;
    }

    const checkValidInput = (obj) => {
        for(let key in obj) {
            if(obj[key] === ""){
                delete obj[key];
            }
        }
        if(Object.keys(obj).length <= 0){
            setError(ErrorMessageShow(`Không được để trống!`))
            return false;
        }
        return true;
    }

    const checkTimeValid = () => {
        let today = moment()
        let newStartTime = newTripPlan.startTime;
        let newEndTime = newTripPlan.endTime;

        if(newStartTime && newEndTime) {
            if(moment(newStartTime).isBefore(today)){
                setError(ErrorMessageShow("Thời gian khởi hành phải sau thời điểm hiện tại!"))
                return false;
            }
            if(moment(newEndTime).isBefore(newStartTime)) {
                setError(ErrorMessageShow("Thời gian kết thúc phải sau thời gian khởi hành!"))
                return false;
            }
        }

        if(newStartTime && !newEndTime && moment(currentTripPlan.endTime).isBefore(newStartTime)) {
            setError(ErrorMessageShow("Thời gian khởi hành phải sau thời gian kết thúc!"))
            
            return false;
        }

        if(newEndTime && !newStartTime && moment(newEndTime).isBefore(currentTripPlan.startTime)) {
            setError(ErrorMessageShow("Thời gian kết thúc phải sau thời gian khởi hành!"))
            return false;
        }

        return true;
    }

    const editTripPlan = async() => {
        if(Object.keys(newTripPlan).length > 0){
            if(!checkValidInput(newTripPlan)){
                return;
            }

            if(!checkTimeValid()){
                return;
            }

            try{
                setLoading(true);

                let form = await ChangeDataToForm(newTripPlan)
                let url = `${endpoints['tripplans']}/${currentTripPlan.id}/update/`;
                let token = await AsyncStorage.getItem("access-token");

                let res = await APIs.patch(url, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer '+ token
                    }
                });

                for(let key in newTripPlan){
                    currentTripPlan[key] = newTripPlan[key]
                }
                goTripPlanDetail(currentTripPlan, {
                    message: "Cập nhật thành công",
                    type: "success"
                })

            } catch(ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

        goTripPlanDetail(currentTripPlan)
    }

    const goTripPlanDetail = (tripplan, toast) => {
        navigation.navigate("Trip", {
            tripplan: tripplan,
            toast: toast
        })
    }

    const updateState = (field, value) => {
        if(field == "expectCost"){
            if(!checkNumValid(parseInt(value))){
                value = 0
            }
            else {
                value = parseInt(value.replace(/\s/g, ''))
            }
        }

        setNewTripPlan(current => {
            return { ...current, [field]: value }
        })
    }

    const formatField = () => {
        currentTripPlan.startTime = moment(currentTripPlan.startTime).format("YYYY-MM-DD HH:mm:ss")
        currentTripPlan.endTime = moment(currentTripPlan.endTime).format("YYYY-MM-DD HH:mm:ss")
    }

    useEffect(() =>{
        formatField()
    }, [])

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} title={"Trip"} buttonText="Hủy"
                dataChange={{
                    "tripplan": currentTripPlan
                }}/>

            <Title title="Chỉnh sửa hành trình"/>

            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TripPlanForm textFields={fields} datetimeFields={datetimeFields} 
                        instance={{
                            "new_tripplan": newTripPlan,
                            "tripplan": currentTripPlan,
                            "error": error,
                            "update_state": (field, value) => updateState(field, value),
                            "loading": loading
                        }} 
                        button={{
                            "text": "Lưu",
                            "on_press": () => editTripPlan()
                        }}/>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

export default EditTripPlan;