import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from './usersSlice';
import {BEIGE} from '../../app/colors';
import Avatar from '../../common/Avatar';
import Text from '../../common/Text';
import Title from '../../common/Title';
import BackButton from '../../common/BackButton';

interface EventScreenProps {
  route: {
    params: {
      userId: string;
    };
  };
}
const DetailsUser: React.FC<EventScreenProps> = ({route}) => {
  const {userId} = route.params;
  const user = useSelector(selectUser(userId));

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <BackButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Avatar friend={user} big style={styles.section} />
        <Title style={styles.section}>{user.name}</Title>
        <Text style={[styles.section, styles.description]}>
          {user.description}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  description: {
    fontSize: 18,
  },
});

export default DetailsUser;