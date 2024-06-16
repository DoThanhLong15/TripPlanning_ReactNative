import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignContent: "stretch",
    }, subject: {
        fontSize: 25,
        fontWeight: "bold",
        color: "blue"
    }, row: {
        flexDirection: "row"
    }, wrap: {
        flexWrap: "wrap"
    }, margin: {
        margin: 5
    },margin_bt: {
        marginBottom: 5
    },mg_t_5: {
        marginTop: 5
    }
    , mg_5: {
        margin: 5
    },mg_10: {
        margin: 10
    },pd_20: {
        padding: 20
    },dp_flex: {
        flex: 1,
        alignItems: "center"
    }, avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },avatar_profile: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginLeft: "auto",
        marginRight: "auto"
    }, title: {
        fontSize: 30,
        fontWeight: "bold"
    }, padding_item: {
        padding: 5,
    },description_area: {
        backgroundColor: "#efcfed",
        borderRadius: 10
    },descrip_title: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        backgroundColor: "#A440EA",
        borderRadius: 10,
    },item_area: {
        backgroundColor: "white",
        borderRadius: 10
    },description: {
        fontSize: 20,
        paddingBottom: 10
    }, comment: {
        fontSize: 20,
        textAlign: "center",
        backgroundColor: "#edd9f9",
        borderRadius: 10,
        marginTop: 5
    },w_100:{
        width: "100%"
    }, w_45: {
        width: "45%"
    },text_center: {
        textAlign: "center"
    },button: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        backgroundColor: "#0051ff",
        borderRadius: 10,
    },fixed_button: {
        alignItems: "flex-start"
    }, pic_full: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 5,
        minHeight: 200
    }, pic_area: {
        flex: 1,
        padding: 5,
        height: "100%",
    }, inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
    }, input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
    }, button_send: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
    }, comment_thumbnail: {
        width: 40,
        height: 40,
        borderRadius: 20
    }, linkText: {
        textDecorationLine: 'underline',
        color: "#0092ff",
        fontSize: 15
    }, icon_button: {
        backgroundColor: "#08f79a",
        borderRadius: 20,
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 10,
        right: 10,
    }, flex_row: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});