import { View, ActivityIndicator, ScrollView, TouchableOpacity, Text } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useContext, useState } from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import { Button, Icon, Searchbar } from "react-native-paper";
import { CheckToastMessage, ToastShow, isCloseToBottom } from "../utils/Utils";
import Item from "../utils/Item";
import { MyUserContext } from './../../configs/Contexts';
import Toast from "react-native-toast-message";
import EmptyList from "../utils/EmptyList";

const TripPlan = ({navigation, route}) => {
    const user = useContext(MyUserContext)
    const [tripplans, setTripPlans] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [q, setQ] = React.useState("");
    const [page, setPage] = React.useState(1);

    const commentCountUpdate = () => {
        if(route.params && route.params.tripplan_id){
            tripplans.forEach((value, index) => {
                if(value.id === route.params.tripplan_id){
                    value.comment_count = route.params.comment_count;
                }
            })
            route.params.tripplan_id = undefined;
        }
    }

    const loadTripPlans = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['tripplans']}?q=${q}&page=${page}`;
            
                let res = await APIs.get(url);
    
                if (res.data.next === null)
                    setPage(0);
    
                if (page === 1)
                    setTripPlans(res.data.results);
                else
                    setTripPlans(current => {
                        res.data.results.forEach(newItem => {
                            current.push(newItem)
                        })
                        return current
                    });
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    const reloadPage = () => {
        if(route.params && route.params.reload){
            route.params.reload = undefined;
            if(page == 1)
                loadTripPlans()
            else 
                setPage(1)
        }
    }

    React.useEffect(() => {
        loadTripPlans();
    }, [q, page]);

    React.useEffect(() => {
        reloadPage();
        CheckToastMessage(route);
        commentCountUpdate();
    })

    const loadMore = ({nativeEvent}) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
                setPage(page + 1);
        }
    }

    const search = (value, callback) => {
        setPage(1);
        callback(value);
    }

    const goTripPlanDetail = (instance) => navigation.navigate("Trip", {'tripplan': instance});
    const goNewTripPlan = () => navigation.navigate("NewTripPlan");

    return (
        <View style={MyStyles.container}>
            <View style={MyStyles.margin}>
                <Searchbar placeholder="Nhập từ khóa..." onChangeText={(t) => search(t, setQ)} value={q} />
            </View>
            <ScrollView onScroll={loadMore}>
                {loading && <ActivityIndicator/>}

                {tripplans.map(tripplan => 
                <TouchableOpacity key={tripplan.id} onPress={t => goTripPlanDetail(tripplan)}> 
                    <View key={tripplan.id} style={[MyStyles.item_area, MyStyles.padding_item, MyStyles.margin_bt]}>
                        <Item instance={tripplan} />
                    </View>
                </TouchableOpacity>)}

                {page != 0 && tripplans.length > 0 && <Button icon="reload" onPress={() => setPage(page + 1)}>Thêm bài viết</Button> }

                <EmptyList list={tripplans} type="hành trình"/>
                
            </ScrollView>

            {user && <TouchableOpacity style={[MyStyles.padding_item, MyStyles.icon_button]} 
                onPress={goNewTripPlan}>
                <Icon source="plus" size={40} color="white"/>
            </TouchableOpacity>}

            <Toast position="top" topOffset={0}/>
        </View>
    );
};

export default TripPlan;