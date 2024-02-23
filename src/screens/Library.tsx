import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import React from 'react';
import {Appbar, Text} from 'react-native-paper';
import BookCover from '../components/BookCover';
import {ZLibraryBookResult} from '../types/books';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {dummyBooks} from '../utils';
import EmptyStateEmoticon from '../components/EmptyStateEmoticon';

const screenWidth = Dimensions.get('window').width;
const numberOfColumns = 3;
const containerPadding = 16;
const columnGap = 10;
const tileWidth =
  (screenWidth - containerPadding * 2 - columnGap * 2) / numberOfColumns;

const Library = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const isFocused = useIsFocused();

  const handleOnPressBook = (book: ZLibraryBookResult) => {
    navigation.push('BookDetails', {book});
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Library" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <FlatList
        key={1}
        numColumns={3}
        data={[]}
        style={styles.list}
        columnWrapperStyle={styles.grid}
        renderItem={({item}) => (
          <BookCover
            book={item}
            width={tileWidth}
            onPress={() => handleOnPressBook(item)}
          />
        )}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{flex: 1}}
        ListEmptyComponent={
          <View className="flex-col justify-center items-center flex-1">
            <View className="pb-4 justify-center items-center">
              <EmptyStateEmoticon focusChange={isFocused} />
            </View>
            <Text className="text-xs">Your library is empty</Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  grid: {
    flex: 1,
    height: '100%',
    columnGap: 10,
  },
});

export default Library;
