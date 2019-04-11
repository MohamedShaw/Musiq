import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import Sound from 'react-native-sound';
import PlayerScreen from 'react-native-sound-playerview';
import { AppView, AppButton, AppNavigation } from '../../common';
import { AppHeader } from '../../component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 30,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(240,240,240,1)',
  },
  button: {
    fontSize: 20,
    backgroundColor: 'rgba(220,220,220,1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    padding: 7,
  },
  header: {
    textAlign: 'left',
  },
  feature: {
    flexDirection: 'row',
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },
});

const Button = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

const Header = ({ children, style }) => (
  <Text style={[styles.header, style]}>{children}</Text>
);
const Feature = ({
  title,
  onPress,
  description,
  buttonLabel = 'PLAY',
  status,
}) => (
  <AppView style={styles.feature} backgroundColor="white">
    <Header style={{ flex: 1 }}>{title}</Header>
    {status ? (
      <Text style={{ padding: 5 }}>{this.resultIcons[status] || ''}</Text>
    ) : null}
    <Button title={buttonLabel} onPress={onPress} />
  </AppView>
);
class MainView extends Component {
  setTestState = (testInfo, component, status) => {
    this.setState({
      tests: { ...this.state.tests, [testInfo.title]: status },
    });
  };

  /**
   * Generic play function for majority of tests
   */
  playSound = (testInfo, component) => {
    this.setState({
      isPlaying: true,
    });
    if (this.state.isPlaying) {
      console.log('is playing');

      return;
    }

    this.setTestState(testInfo, component, 'pending');

    const callback = (error, sound) => {
      if (error) {
        this.setState({
          isPlaying: false,
        });
        Alert.alert('error', error.message);
        this.setTestState(testInfo, component, 'fail');
        return;
      }
      this.setTestState(testInfo, component, 'playing');
      // Run optional pre-play callback
      testInfo.onPrepared && testInfo.onPrepared(sound, component);
      sound.play(() => {
        // Success counts as getting to the end
        this.setTestState(testInfo, component, 'win');
        // Release when it's done so we're not using up resources
        sound.release();
      });
    };

    // If the audio is a 'require' then the second parameter must be the callback.
    if (testInfo.isRequire) {
      const sound = new Sound(testInfo, error => callback(error, sound));
    } else {
      const sound = new Sound(testInfo, testInfo.basePath, error =>
        callback(error, sound),
      );
    }
  };

  playSoundsTOP = (testInfo, component) => {
    this.setState({ isPlaying: false });
    const callback = (error, sound) => {
      if (error) {
        Alert.alert('error', error.message);
        this.setTestState(testInfo, component, 'fail');
        return;
      }
      // Run optional pre-play callback
      testInfo.onPrepared && testInfo.onPrepared(sound, component);
      sound.stop(() => {
        console.log('STOP ssssssssssssss');

        // Success counts as getting to the end
        // Release when it's done so we're not using up resources
        sound.stop().release();
      });
    };

    // If the audio is a 'require' then the second parameter must be the callback.

    const sound = new Sound(testInfo, testInfo.basePath, error =>
      callback(error, sound),
    );
  };

  constructor(props) {
    super(props);
    this.resultIcons = {
      '': '',
      pending: '?',
      playing: '\u25B6',
      win: '\u2713',
      fail: '\u274C',
    };

    Sound.setCategory('Playback', true); // true = mixWithOthers

    this.stopSoundLooped = () => {
      console.log('stop presss');
      Sound.setCategory('stop', true);
      if (!this.state.loopingSound) {
        console.log('if state ment');

        return;
      }

      this.state.loopingSound.stop().release();
      this.setState({
        loopingSound: null,
        tests: { ...this.state.tests, 'mp3 in bundle (looped)': 'win' },
      });
    };

    this.state = {
      loopingSound: undefined,
      tests: props.data,
      isPlaying: false,
    };
  }

  render() {
    return (
      <AppView
        stretch
        flex
        center
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0, .6)',
        }}
      >
        <AppView stretch flex>
          <AppHeader title={this.props.data.title} />

          <Feature
            status={this.state.tests[this.props.data.title]}
            key={this.props.data.id}
            title={this.props.data.title}
            onPress={() =>
              this.playSound(
                `https://www.musiqar.com/uploads/tracks/${
                  this.props.data.name
                }`,
              )
            }
          />
          <Feature
            title="mp3 in bundle (looped)"
            buttonLabel="STOP"
            onPress={() =>
              this.playSoundsTOP(
                `https://www.musiqar.com/uploads/tracks/${
                  this.props.data.name
                }`,
              )
            }
          />

          <AppButton
            title="press"
            onPress={() => {
              AppNavigation.push({
                name: 'PlayerScreen',
                passProps: {
                  title: 2,
                  filepath: `https://www.musiqar.com/uploads/tracks/${
                    this.props.data.name
                  }`,
                },
              });
            }}
          />
        </AppView>
      </AppView>
    );
  }
}

export default MainView;
