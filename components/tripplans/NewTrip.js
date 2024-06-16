import { Text } from "react-native-paper"
import GoBackButton from "../utils/GoBackButton";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { TimeField, TextFields } from "./TripFields";

const NewTrip = ({navigation, route}) => {
    const goBackButton = {
        title: route.goBackTitle,
        buttonText: "Hủy"
    }
    const textFields = TextFields
    const timeField = TimeField

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} 
                title={goBackButton.title} 
                buttonText={goBackButton.buttonText} />

            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                </KeyboardAvoidingView>
            </ScrollView>
            
            <Text>NewTrip</Text>
        </View>
    )
}

export default NewTrip;