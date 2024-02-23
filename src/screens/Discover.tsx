import {
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import BookCover from '../components/BookCover';
import {ZLibraryBookResult} from '../types/books';
import {useNavigation} from '@react-navigation/native';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMutation, useQuery} from 'react-query';
import {getMostPopularBooks, searchForBook} from '../api/books';

const screenWidth = Dimensions.get('window').width;
const numberOfColumns = 3;
const containerPadding = 16;
const columnGap = 10;
const tileWidth =
  (screenWidth - containerPadding * 2 - columnGap * 2) / numberOfColumns;

const Discover = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [books, setBooks] = useState<ZLibraryBookResult[]>([]);
  const {
    isFetching: isPopularBooksFetching,
    refetch: refetchMostPopularBooks,
    data: mostPopularBooks,
  } = useQuery('most-popular', getMostPopularBooks);
  const {
    mutate: findBook,
    isLoading: isSearchLoading,
    data: searchBookResults,
  } = useMutation((query: string) => searchForBook(query));
  const theme = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<ZLibraryBookResult>>(null);

  const handleOnPressBook = (book: ZLibraryBookResult) => {
    navigation.push('BookDetails', {book});
  };

  const onRefresh = useCallback(() => {
    refetchMostPopularBooks();
  }, [refetchMostPopularBooks]);

  useEffect(() => {
    if (mostPopularBooks) {
      setBooks(mostPopularBooks);
    }
  }, [mostPopularBooks]);

  useEffect(() => {
    if (searchBookResults) {
      searchBookResults.forEach(book => {
        book.description = book.description
          ?.replace(/<br>/g, '\n')
          .replace(/<.*?>/g, '');
      });
      setBooks(searchBookResults);
    }
  }, [searchBookResults]);

  return (
    <>
      <Appbar.Header>
        {!showSearchInput && <Appbar.Content title="Discover" />}
        {showSearchInput && (
          <Appbar.Content
            titleStyle={styles.appHeaderText}
            title={
              (
                <Searchbar
                  ref={searchInputRef}
                  className="bg-transparent"
                  placeholder="Search..."
                  icon="arrow-left"
                  onIconPress={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                    setBooks(mostPopularBooks || []);
                  }}
                  value={searchQuery}
                  onChangeText={text => setSearchQuery(text)}
                  onSubmitEditing={() => {
                    if (searchQuery) {
                      flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: false,
                      });
                      findBook(searchQuery);
                    }
                  }}
                />
              ) as ReactNode & string
            }
          />
        )}
        {!showSearchInput && (
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              setShowSearchInput(true);
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 100);
            }}
          />
        )}
      </Appbar.Header>
      <FlatList
        ref={flatListRef}
        key={1}
        numColumns={3}
        data={books}
        style={styles.list}
        columnWrapperStyle={styles.grid}
        refreshControl={
          <RefreshControl
            progressViewOffset={0}
            progressBackgroundColor={theme.colors.primaryContainer}
            colors={[theme.colors.primary]}
            refreshing={isPopularBooksFetching || isSearchLoading}
            onRefresh={onRefresh}
          />
        }
        renderItem={({item}) => (
          <BookCover
            book={item}
            width={tileWidth}
            onPress={() => handleOnPressBook(item)}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  appHeaderText: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
  grid: {
    flex: 1,
    // height: '100%',
    columnGap: 10,
    // rowGap: 40,
  },
});

export default Discover;
