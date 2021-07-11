import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import Text from '../../common/Text';

const TonightScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.empty}>
        <Title style={styles.emptyText}>
          {translate('Comming soon... 😏 ')}
        </Title>
        <Text style={styles.emptySubtext}>
          {translate(
            'Tu en as marre de spammer tes potes pour savoir qui veut sortir ce soir ? Cette section sera pour toi 🥰',
          )}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    marginBottom: 20,
  },
  emptySubtext: {
    fontSize: 18,
  },
});

export default TonightScreen;
