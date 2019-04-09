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
  <View style={styles.feature}>
    <Header style={{ flex: 1 }}>{title}</Header>
    {status ? (
      <Text style={{ padding: 5 }}>{this.resultIcons[status] || ''}</Text>
    ) : null}
    <Button title={buttonLabel} onPress={onPress} />
  </View>
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
    this.setTestState(testInfo, component, 'pending');

    const callback = (error, sound) => {
      if (error) {
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

  constructor(props) {
    super(props);
    this.resultIcons = {
      '': '',
      pending: '?',
      playing: '\u25B6',
      win: '\u2713',
      fail: '\u274C',
    };
    this.audioTests = [
      {
        title: 'mp3 in bundle',
        url: `https://www.musiqar.com/uploads/tracks/${this.props.data.name}`,
        basePath: Sound.MAIN_BUNDLE,
      },
      {
        title: 'mp3 in bundle (looped)',
        url: `https://www.musiqar.com/uploads/tracks/${this.props.data.name}`,
        basePath: Sound.MAIN_BUNDLE,
        onPrepared: (sound, component) => {
          sound.setNumberOfLoops(-1);
          component.setState({ loopingSound: sound });
        },
      },
      {
        title: 'mp3 via require()',
        isRequire: true,
        url: `https://www.musiqar.com/uploads/tracks/${this.props.data.name}`,
      },
      {
        title: 'mp3 remote download',
        url:
          'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3',
      },
      {
        title: "mp3 remote - file doesn't exist",
        url:
          'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/file-not-here.mp3',
      },
      {
        title: 'aac remote download',
        url:
          'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac',
      },
      {
        title: 'wav remote download',
        url:
          'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/frog.wav',
      },
      {
        title: 'aac via require()',
        isRequire: true,
        url: `https://www.musiqar.com/uploads/tracks/${this.props.data.name}`,
      },
      {
        title: 'wav via require()',
        isRequire: true,
        url: `https://www.musiqar.com/uploads/tracks/${this.props.data.name}`,
      },
    ];

    Sound.setCategory('Playback', true); // true = mixWithOthers

    // Special case for stopping
    this.stopSoundLooped = () => {
      if (!this.state.loopingSound) {
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
      tests: {},
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.title}>react-native-sound-demo</Header>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
        >
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
            onPress={this.stopSoundLooped}
          />
        </ScrollView>
      </View>
    );
  }
}

export default MainView;
