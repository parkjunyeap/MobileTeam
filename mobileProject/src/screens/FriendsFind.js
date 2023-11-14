// FriendsFind.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FriendsFind = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]); // 상태 이름을 'FriendsList'에서 'friendsList'로 변경
  const navigation = useNavigation();

  const handleSearch = () => {
    // 검색 로직 (실제 앱에서는 백엔드 API 호출)
    const dummyResults = [
      { id: '1', name: 'Jane Doe' },
      { id: '2', name: 'John Doe' },
      // ... 더 많은 더미 데이터
    ];
    setSearchResults(dummyResults.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
  };

  const addFriend = (friend) => {
    setFriendsList(currentFriends => {
      const isAlreadyFriend = currentFriends.some(f => f.id === friend.id);
      
      if (!isAlreadyFriend) {
        const updatedFriendsList = [...currentFriends, friend];
        // Navigate to FriendsList screen with the updated friends list
        navigation.navigate('FriendsList', { friendsList: updatedFriendsList });
        return updatedFriendsList;
      }
  
      return currentFriends;
    });
  };

const FriendsFind = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="친구 검색..."
        value={query}
        onChangeText={text => setQuery(text)}
      />
      <Button title="검색" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addFriend(item)}>
              <Text style={styles.addButtonText}>친구 추가</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
  },
});
}
export default FriendsFind;
