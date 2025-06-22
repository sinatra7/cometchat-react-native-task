import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';

const appID = "277685c7a469b0dd";
const region = "in";
const authKey = "58fa19025a302eb2caddac9b140e18624a9c9a99";

const App = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    CometChat.init(appID, appSetting).then(() => {
      console.log('CometChat initialized');
      CometChat.login("cometchat-uid-1", authKey).then(
        user => {
          console.log("Login successful", user);
          fetchUsers();
        },
        error => {
          console.log("Login failed", error);
        }
      );
    });
  }, []);

  const fetchUsers = () => {
  const limit = 30;
  const usersRequest = new CometChat.UsersRequestBuilder()
    .setLimit(limit)
    .build();

  usersRequest.fetchNext().then(userList => {
    console.log("Fetched Users:", userList);
    setUsers(userList);
  }).catch(error => {
    console.log("User fetch error:", error);
  });
};

  const openChat = (user) => {
    setSelectedUser(user);

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(user.getUid())
      .setLimit(30)
      .build();

    messagesRequest.fetchPrevious().then(msgs => {
      setMessages(msgs);
    });
  };

  if (selectedUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Chat with {selectedUser.getName()}</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text>{item.sender.uid}: {item.text}</Text>
          )}
        />
        <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.back}>
          <Text style={{ color: 'white' }}>Back to Users</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a User to Chat</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item)} style={styles.userItem}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 30 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  userItem: {
  padding: 12,
  marginBottom: 10,
  backgroundColor: '#87CEEB',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  },
  back: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  }
});

export default App;
