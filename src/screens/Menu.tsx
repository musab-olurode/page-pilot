import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {Divider, List, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

const MENU_ITEMS: {
  icon: IconSource;
  title: string;
  route: keyof RootNavigatorParamList;
}[] = [{icon: 'sync', title: 'Services', route: 'Services'}];

const Menu = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View className="flex flex-row justify-center items-center py-8">
            <Text>¯\_(ツ)_/¯</Text>
          </View>
          <Divider className="h-[0.45px]" />
        </View>
      }
      data={MENU_ITEMS}
      style={styles.list}
      renderItem={({item}) => (
        <List.Item
          title={item.title}
          // eslint-disable-next-line react/no-unstable-nested-components
          left={props => <List.Icon {...props} icon={item.icon} />}
          onPress={() => navigation.push(item.route)}
        />
      )}
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{flex: 1}}
    />
  );
};

const styles = StyleSheet.create({
  list: {},
});

export default Menu;
