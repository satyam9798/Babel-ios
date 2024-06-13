import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import ChatList from './ChatList';

const ChatScene = ({ data, navigation }) => {
    useEffect(() => {
    })
    return (
        <ScrollView>
            {data && data.length >= 1 ? <>
                {data.map((data, index) => { return <ChatList key={index} data={data} navigation={navigation} /> })}
            </> : <></>}
        </ScrollView>
    )
}

export default ChatScene
