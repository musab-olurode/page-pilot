import {Pressable, View} from 'react-native';
import React from 'react';
import {ZLibraryBookResult} from '../types/books';
import AutoHeightImage from './AutoImageHeight';
import {Text} from 'react-native-paper';

export interface BookCoverProps {
  book: ZLibraryBookResult;
  width: number;
  onPress?: () => void;
}

const BookCover = ({book, width, onPress}: BookCoverProps) => {
  const maxHeight = width * 1.7;

  return (
    <Pressable
      onPress={onPress}
      className="flex flex-col mb-4 justify-end"
      style={{
        width,
      }}>
      <View className="rounded-r-lg overflow-hidden">
        <AutoHeightImage
          source={{uri: book.cover}}
          width={width}
          maxHeight={maxHeight}
        />
      </View>
      <Text className="text-xs pt-1" numberOfLines={1}>
        {book.title}
      </Text>
      <Text className="text-xs" numberOfLines={1}>
        {book.author}
      </Text>
    </Pressable>
  );
};

export default BookCover;
