import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  Share,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  Appbar,
  Avatar,
  Button,
  Chip,
  Icon,
  IconButton,
  List,
  MD3Theme,
  Menu,
  useTheme,
} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {GoodreadsScrapper} from '../services/goodreads';
import ExpandingText from '../components/ExpandingText';
import {CombinedBook, GoodreadsReview} from '../types/books';
import {useAppDispatch} from '../redux/hooks';
import {showSnackbar} from '../redux/snackbar/snackbarSlice';
import {GOODREADS_DEFAULT_AVATAR_URL} from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../components/StarRating';
import AutoHeightImage from '../components/AutoImageHeight';

const ListEmptyComponent = () => (
  <View className="flex flex-row justify-center items-center p-4">
    <Text>No reviews found</Text>
  </View>
);

const ListFooterComponent = ({onPress}: {onPress: () => void}) => (
  <View className="flex flex-row justify-end">
    <Button
      icon="open-in-new"
      contentStyle={styles.seeMoreReviewsButton}
      onPress={onPress}>
      See more reviews
    </Button>
  </View>
);

const ListHeaderComponent = ({
  bookDetails,
  theme,
  descriptionExpanded,
  setDescriptionExpanded,
  handleOnPressWebview,
  webviewUrl,
}: {
  bookDetails: CombinedBook;
  theme: MD3Theme;
  descriptionExpanded: boolean;
  setDescriptionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnPressWebview: () => void;
  webviewUrl?: string;
}) => (
  <>
    <ImageBackground source={{uri: bookDetails.cover}} className="pt-32 px-4">
      <LinearGradient
        colors={[
          theme.colors.background.replace('1)', '0.8)'),
          theme.colors.background,
        ]}
        style={styles.detailsHeroGradient}
      />
      <View className="flex flex-row items-center">
        <View className="flex flex-col justify-center h-[192]">
          <View className="rounded-r-lg overflow-hidden">
            <AutoHeightImage width={128} source={{uri: bookDetails.cover}} />
          </View>
        </View>
        <View className="pl-4 flex-col" style={styles.bookDetails}>
          <Text className="text-sm italic">
            {bookDetails.series || 'Unknown Series'}
          </Text>
          <Text className="text-xl font-bold">{bookDetails.title}</Text>
          <Text className="text-sm">{bookDetails.author}</Text>
          <View className="flex flex-row items-center pt-2">
            <StarRating class="pl-2" rating={bookDetails.rating || 0} />
            <Text className="px-2">·</Text>
            <Text className="font-bold">
              {bookDetails.rating?.toFixed(2) || '0'}
            </Text>
          </View>
          <Text className="pt-1">
            {bookDetails.ratingsCount?.toLocaleString(undefined, {
              useGrouping: true,
            }) || 0}{' '}
            ratings
          </Text>
        </View>
      </View>
    </ImageBackground>
    <View className="flex flex-row items-center pt-4 pb-2 px-4">
      <Button icon="heart-outline" mode="contained-tonal" className="grow">
        Add to library
      </Button>
      <IconButton
        disabled={!webviewUrl}
        accessibilityLabel="Webview"
        mode="contained-tonal"
        icon="earth"
        onPress={handleOnPressWebview}
      />
    </View>
    <ExpandingText
      class="mx-4"
      onToggleExpand={setDescriptionExpanded}
      text={bookDetails.description || 'No Description'}
    />
    <ScrollView
      horizontal={!descriptionExpanded}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        // eslint-disable-next-line react-native/no-inline-styles
        {paddingHorizontal: 16},
        descriptionExpanded && styles.genresContainer,
      ]}
      className="flex flex-row flex-wrap pt-3 gap-1">
      {bookDetails.genres?.map(genre => (
        <Chip key={genre}>{genre}</Chip>
      ))}
    </ScrollView>
    <View className="flex flex-row justify-between items-end px-4">
      <View className="flex flex-row items-end pt-4">
        <Text className="text-xs">
          {bookDetails.numberOfPages || '0'} pages,
        </Text>
        <Text className="text-xs pl-1">
          {bookDetails.type || 'Unknown Book Type'}
        </Text>
      </View>
      <Text className="text-xs pt-1">
        First published {bookDetails.firstPublishDate || 'Unknown'}
      </Text>
    </View>
    <Text className="font-bold text-md pt-4 px-4">Reviews</Text>
  </>
);

const Review = ({review}: {review: GoodreadsReview; theme: MD3Theme}) => (
  <List.Accordion
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      paddingVertical: 0,
    }}
    title={review.userName}
    // eslint-disable-next-line react-native/no-inline-styles
    titleStyle={{
      width: '90%',
    }}
    description={`Rating: ${review.rating}`}
    // eslint-disable-next-line react/no-unstable-nested-components
    left={props => (
      <Avatar.Image
        size={24}
        {...props}
        source={{uri: review.userAvatar || GOODREADS_DEFAULT_AVATAR_URL}}
      />
    )}
    // eslint-disable-next-line react/no-unstable-nested-components
    right={props => (
      <View className="flex flex-row items-center justify-center gap-x-8">
        <StarRating class="pl-2" rating={review.rating || 0} />
        <Icon
          size={20}
          source={props.isExpanded ? 'chevron-up' : 'chevron-down'}
        />
      </View>
    )}>
    <Text className="pr-8">{review.reviewText}</Text>
  </List.Accordion>
);

const BookDetails = ({
  route,
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {book} = route.params as RootNavigatorParamList['BookDetails'];
  const [bookDetails, setBookDetails] = useState<CombinedBook>({...book});
  const [refreshing, setRefreshing] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [webviewUrl, setWebviewUrl] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAtScrollTop, setIsAtScrollTop] = useState(true);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleOnPressWebview = () => {
    navigation.push('CustomWebView', {
      url: webviewUrl,
      title: bookDetails.title,
    });
  };

  const handleOnPressGotoWebviewReviews = () => {
    navigation.push('CustomWebView', {
      url: webviewUrl + '#CommunityReviews',
      title: bookDetails.title,
    });
  };

  const shareLink = async () => {
    setMenuVisible(false);
    Share.share(
      {
        message: bookDetails.url,
        url: bookDetails.url!,
        title: bookDetails.title,
      },
      {
        dialogTitle: bookDetails.title,
      },
    );
  };

  const closeMenu = () => setMenuVisible(false);
  const openMenu = () => setMenuVisible(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GoodreadsScrapper.getBookInfo(book.title, [book.author])
      .then(bookInfo => {
        setBookDetails({...book, ...bookInfo});
        setWebviewUrl(bookInfo.url!);
        setRefreshing(false);
      })
      .catch(error => {
        dispatch(showSnackbar({message: error.message}));
        setRefreshing(false);
      });
  }, [book, dispatch]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <>
      <StatusBar
        backgroundColor={
          isAtScrollTop ? 'transparent' : theme.colors.background
        }
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      <Appbar.Header
        statusBarHeight={0}
        style={[
          styles.appBar,
          !isAtScrollTop && {backgroundColor: theme.colors.background},
        ]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: 'transparent',
          }}
          title=""
        />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={openMenu}
              disabled={!bookDetails.url}
            />
          }>
          <Menu.Item onPress={shareLink} title="Share" />
        </Menu>
      </Appbar.Header>
      <FlatList
        refreshControl={
          <RefreshControl
            progressViewOffset={90}
            progressBackgroundColor={theme.colors.primaryContainer}
            colors={[theme.colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        className="flex"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{backgroundColor: theme.colors.background, flex: 1}}
        ListHeaderComponent={
          <ListHeaderComponent
            bookDetails={bookDetails}
            theme={theme}
            descriptionExpanded={descriptionExpanded}
            setDescriptionExpanded={setDescriptionExpanded}
            handleOnPressWebview={handleOnPressWebview}
            webviewUrl={webviewUrl}
          />
        }
        data={bookDetails.reviews}
        keyExtractor={(item, index) =>
          `${item.userName.replace(' ', '-')}-${index}`
        }
        contentContainerStyle={styles.listViewContentContainer}
        renderItem={({item: review}) => (
          <Review theme={theme} review={review} />
        )}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          bookDetails.reviews && bookDetails.reviews?.length === 10 ? (
            <ListFooterComponent onPress={handleOnPressGotoWebviewReviews} />
          ) : null
        }
        // change appbar background color to white when scrolling
        onScroll={event => {
          const scrollPosition = event.nativeEvent.contentOffset.y;
          if (scrollPosition > 0) {
            setIsAtScrollTop(false);
          } else {
            setIsAtScrollTop(true);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
    top: StatusBar.currentHeight,
    left: 0,
    width: '100%',
  },
  listViewContentContainer: {
    paddingBottom: 20,
  },
  bookDetails: {
    flex: 1,
  },
  detailsHeroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '120%',
    height: '175%',
  },
  ratingStars: {
    alignItems: 'flex-start',
  },
  genresContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seeMoreReviewsButton: {
    flexDirection: 'row-reverse',
  },
});

export default BookDetails;
