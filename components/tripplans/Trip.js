import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useContext, useEffect, useState } from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import Item from "../utils/Item";
import { Button, Icon, TextInput } from "react-native-paper";
import { CheckToastMessage, ShowAlert, ToastShow } from "../utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { MyUserContext } from "../../configs/Contexts";
import TripDetail from "./TripDetail";
import Comment from "../utils/Comment";
import EmptyList from "../utils/EmptyList";
import GoBackButton from "../utils/GoBackButton";

const Trip = ({navigation, route}) => {
    const user = useContext(MyUserContext)
    const tripplan = route.params.tripplan;
    const [comment, setComment] = useState("");
    const [commentShow, setCommentShow] = useState(true);
    const [commentList, setCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trip, setTrip] = useState([])
    

    const loadTrip = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['tripplans']}/${tripplan.id}/trips/`;
            let res = await APIs.get(url);

            setTrip(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadComment = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['tripplans']}/${tripplan.id}/comments/?page=${page}`;
                let res = await APIs.get(url);
    
                if (res.data.next === null)
                    setPage(0);
    
                if (page === 1)
                    setCommentList(res.data.results);
                else{
                    setCommentList(current => {
                        res.data.results.forEach(newItem => {
                            current.push(newItem)
                        })
                        return current
                    });
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    const postComment = async () => {
        if(comment != ""){
            setLoading(true);
            try {
                let url = `${endpoints['tripplans']}/${tripplan.id}/comment/`;
                let token = await AsyncStorage.getItem('access-token');
    
                let res = await APIs.post(url, {
                    "content": comment
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setCommentList(current => [res.data, ...current])
                tripplan.comment_count += 1;
                setComment("")
                ToastShow("Thêm bình luận thành công!", "success")
               
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
        else {
            ToastShow("Vui lòng nhập bình luận!", "warning")
        }
    }

    const loadMoreComment = () => {
        if (!loading && page > 0) {
                setPage(page + 1);
        }
    }

    const deleteAlert = () => {
        ShowAlert("Thông báo", "Bạn có chắc chắn xóa không?", () => deleteTripPlan())
    }

    const deleteTripPlan = async () => {
        try{
            let url = `${endpoints['tripplans']}/${tripplan.id}/delete/`;
            const token = await AsyncStorage.getItem('access-token');
            let res = await APIs.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            navigation.navigate("TripPlan", { 
                "toast": {
                    "message": "Xóa hành trình thành công!",
                    "type": "success"
                }, 'reload': true
            });

        } catch(ex) {
            console.error(ex);
        } 
    }

    const addUserJoinTripPlan = async (user_join_id) => {
        console.log('add')
        if(user_join_id != tripplan.user.id) {
            try{
                let url = `${endpoints['tripplans']}/${tripplan.id}/user-join/`;
                const token = await AsyncStorage.getItem('access-token');
                let res = await APIs.post(url, {
                    "user_id": user_join_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                ToastShow("Thêm người tham gia thành công!", "success")
            } catch(ex) {
                console.error(ex);
            }
        }
    }

    const removeUserJoinTripPlan = async (user_join_id) => {
        console.log('remove')
        if(user_join_id != tripplan.user.id) {
            try{
                let url = `${endpoints['tripplans']}/${tripplan.id}/user-join/`;
                const token = await AsyncStorage.getItem('access-token');
                let res = await APIs.delete(url, {
                    data: {
                        "user_id": user_join_id
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                ToastShow("Xóa người tham gia thành công!", "success")
            } catch(ex) {
                console.error(ex);
            }
        }
    }

    const goNewTrip = () => {
        navigation.navigate("NewTrip", {
            "tripplan": tripplan
        })
    }

    const goEditTripPlan = () => {
        navigation.navigate("EditTripPlan", {
            "tripplan": tripplan
        })
    }

    const goReportUser = () => {
        navigation.navigate("ReportUser", {
            "tripplan": tripplan
        })
    }

    const checkNewTrip = () => {
        if(route.params && route.params.createdTrip){
            let createdTrip = route.params.createdTrip
            setTrip(current => {
                return [...current, ...createdTrip]
            })
            route.params.createdTrip = undefined
        }
    }

    const checkEditTrip = () => {
        if(route.params && route.params.editTrip){
            let editTrip = route.params.editTrip
            setTrip(current => {
                return current.map(t => {
                    if(t.id === editTrip.id){
                        t = editTrip
                    }
                    return t
                })
            })
            route.params.editTrip = undefined
        }
    }

    const deleteTrip = async (trip_id) => {
        try {
            let url = `${endpoints["trips"]}/${trip_id}/delete/`
            const token = await AsyncStorage.getItem('access-token');
            let res = await APIs.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            ToastShow("Xóa điểm đến thành công", "success")
            loadTrip()
        } catch (ex) {
            console.error(ex);
        }
    }

    const editTrip = (trip) => {
        navigation.navigate("EditTrip", {
            "tripplan": tripplan,
            "trip": trip
        })
    }

    const deleteComment = async (comment_id) => {
        try {
            let url = `${endpoints["comments"]}/${comment_id}/`
            const token = await AsyncStorage.getItem('access-token');
            let res = await APIs.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            ToastShow("Xóa bình luận thành công", "success")
            setCommentList(current => {
                return current.filter(c => c.id!== comment_id)
            })
        } catch (ex) {
            console.error(ex);
        }
    }

    const editComment = async (comment_id, content) => {
        try {
            let url = `${endpoints["comments"]}/${comment_id}/`
            const token = await AsyncStorage.getItem('access-token');
            let res = await APIs.patch(url, {
                "content": content
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            ToastShow("Chỉnh sửa bình luận thành công", "success")
            setCommentList(current => {
                return current.map(c => {
                    if(c.id === comment_id){
                        c.content = content
                    }
                    return c
                })
            })
        } catch (ex) {
            console.error(ex);
        }
    }

    const toggleComment = async (status) => {
        try {
            let url = `${endpoints["tripplans"]}/${tripplan.id}/update/`
            const token = await AsyncStorage.getItem('access-token');
            let res = await APIs.patch(url, {
                "status": status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            let text = status ? "Khóa": "Mở khóa";
            ToastShow(`${text} bình luận thành công`, "success")
            tripplan.status = status
            setCommentShow(status)
        } catch (ex) {
            console.error(ex);
        }
    }

    const showToggleComment = () => {
        return <Button style={[MyStyles.w_50, MyStyles.comment]}
                onPress={() => toggleComment(!tripplan.status)}>
                {tripplan.status ? "Khóa": "Mở khóa"} bình luận
            </Button>
    }

    useEffect(() => {
        loadComment();
    }, [page]);

    useEffect(() => {
        loadTrip();
    }, [])

    useEffect(() => {
        checkEditTrip()
        checkNewTrip()
        CheckToastMessage(route)
    })

    return (
        <View style={MyStyles.container}>

            <GoBackButton navigation={navigation} buttonText="Trở về" title="TripPlan" 
                dataChange={{ 
                    'tripplan_id': tripplan.id,
                    'comment_count': tripplan.comment_count
                }}/>

            <ScrollView>
                {/* tripplan info */}
                <View key={tripplan.id} style={[MyStyles.item_area, MyStyles.padding_item, MyStyles.margin_bt]}>
                    <Item instance={tripplan} />
                </View>


                {/* button update, delete */}
                {user?.id === tripplan.user.id && 
                <View style={[MyStyles.flex_row, MyStyles.margin_bt]}>
                    <Button style={[MyStyles.w_20, MyStyles.comment]}
                        onPress={goEditTripPlan}>Sửa
                    </Button>
                    
                    <Button style={[MyStyles.w_20, MyStyles.comment]}
                        onPress={deleteAlert}>Xóa
                    </Button>

                    {showToggleComment()}
                </View>}

                {user && user?.id !== tripplan.user.id && 
                    <View style={[MyStyles.flex_row, MyStyles.margin_bt]}>
                        <Button style={[MyStyles.w_80, MyStyles.comment]}
                            onPress={goReportUser}>Báo cáo
                        </Button>
                    </View>}
            

                {/* trip of tripplan */}
                <Text style={[MyStyles.padding_item, MyStyles.descrip_title]}>Các điểm đến</Text>

                {loading && <ActivityIndicator/>}
                {trip.map(f => 
                    <View key={f.id} style={[MyStyles.item_area, MyStyles.pic_area, MyStyles.margin_bt]}>
                        <TripDetail instance={f} user={user} owner_id={tripplan.user.id}
                            buttonHandle={{
                                "delete": (id) => deleteTrip(id),
                                "edit": (trip) => editTrip(trip)
                            }}/>
                    </View>)}

                <EmptyList list={trip} type="điểm đến"/>

                {user?.id === tripplan.user.id && 
                <View style={[MyStyles.margin]}>
                    <Button mode="contained"
                        onPress={goNewTrip}>Tạo điểm đến
                    </Button>
                </View>}
                

                {/* comment area */}
                <Text style={[MyStyles.padding_item, MyStyles.descrip_title]}>Bình luận</Text>

                {loading && <ActivityIndicator/>}
                {page != 0 && commentList.length > 0 && <Button icon="reload" onPress={loadMoreComment}>Thêm bình luận</Button>}

                {commentList.map(f => 
                    <View key={f.id} style={[MyStyles.item_area, MyStyles.padding_item, MyStyles.margin_bt]}>
                        <Comment instance={f} tripplanOwnerId={tripplan.user.id} 
                            currentUser={user} 
                            userJoinHandle={{
                                "remove": (id) => removeUserJoinTripPlan(id),
                                "add": (id) => addUserJoinTripPlan(id)
                            }}
                            buttonHandle={{
                                "delete": (id) => deleteComment(id),
                                "edit": (id, content) => editComment(id, content)
                            }}
                            commentShow={(state) => setCommentShow(state)}/>
                    </View>)}

                <EmptyList list={commentList} type="bình luận"/>

            </ScrollView>


            {/* post comment */}
            {tripplan.status && user && commentShow && 
                <View style={MyStyles.inputContainer}>
                    <TextInput style={MyStyles.input}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Viết bình luận ..."
                    />
                    <TouchableOpacity style={MyStyles.button_send} 
                        onPress={postComment} 
                        loading={loading}>
                        <Icon source="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>}

            <Toast position="top" topOffset={0}/>
        </View>
    );
};

export default Trip;