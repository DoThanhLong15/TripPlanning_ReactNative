import { View } from "react-native";
import Title from "../utils/Title";
import { Button, HelperText, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { useContext, useState } from "react";
import GoBackButton from "../utils/GoBackButton";
import { MyUserContext } from "../../configs/Contexts";
import { ChangeDataToForm, CheckEmptyInput } from "../utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints } from "../../configs/APIs";

const ReportUser = ({navigation, route}) => {
    const user = useContext(MyUserContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({visible: false});
    const [report, setReport] = useState({
        "reported_user_id": route.params.tripplan.user.id
    });
    const fields = [{
        label: "Tiêu đề",
        name: "title",
        icon: "format-title",
    },
    {
        label: "Mô tả",
        name: "description",
        icon: "text",
    }];
    const reported_user = route.params.tripplan.user


    const sendReport = async () => {
        validateFields = CheckEmptyInput(report, fields)
        setError(validateFields)
        if(validateFields.visible)
            return;

        try {
            setLoading(true);
            let form = await ChangeDataToForm(report)
            let token = await AsyncStorage.getItem('access-token')
            let res = await APIs.post(`${endpoints['report-user']}/create/`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + token
                }
            })

            setLoading(false);
            navigation.navigate("Trip", {
                "tripplan": route.params.tripplan,
                "toast": {
                    message: "Báo cáo vi phạm thành công",
                    type: "success"
                }
            });

        } catch(ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const update_state = (field, value) => {
        setReport(current => {
            return {...current, [field]: value}
        })
    }

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} title="Trip" buttonText="Hủy bỏ"
                dataChange={{
                    "tripplan": route.params.tripplan
                }}/>

            <Title title="Báo cáo vi phạm" />

            {fields.map(f => <TextInput style={MyStyles.margin} key={f.name} 
                value={report[f.name]}
                label={f.label} 
                right={<TextInput.Icon icon={f.icon}/>} 
                onChangeText={text => update_state(f.name, text)}
            />)}

            <TextInput disabled={true} 
                value={reported_user.last_name + " " + reported_user.first_name} />

            {/* error area  */}
            <HelperText type="error" visible={error.visible}>
                {error.message}
            </HelperText>

            <Button style={[MyStyles.margin]} 
                mode="contained"
                onPress={sendReport}
                loading={loading}>Gửi báo cáo
            </Button>
        </View>
    );
}

export default ReportUser;