import React from 'react';
import {
  View,
  Image,
  Text,
  Slider,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import Sound from 'react-native-sound';

import SpinKit from 'react-native-spinkit';
import {
  AppView,
  AppButton,
  AppNavigation,
  AppIcon,
  AppImage,
} from '../../common';

const img_speaker = require('../../assets/imgs/ui_speaker.png');
const img_pause = require('../../assets/imgs/ui_pause.png');
const img_play = require('../../assets/imgs/ui_play.png');
const img_playjumpleft = require('../../assets/imgs/ui_playjumpleft.png');
const img_playjumpright = require('../../assets/imgs/ui_playjumpright.png');

const path = 'https://www.musiqar.com/uploads/tracks/';
export default class PlayerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playState: 'paused', // playing, paused
      playSeconds: 0,
      duration: 0,
      vIndex: props.allData.findIndex(v => v.id === props.id),
    };
    this.sliderEditing = false;
  }

  componentDidMount() {
    const vIndex = this.props.allData.findIndex(v => v.id === this.props.id);

    next = this.props.allData[vIndex + 1].name;
    prev = vIndex !== 0 && this.props.allData[vIndex - 1].name;
    nextPath = `https://www.musiqar.com/uploads/tracks/${next}`;
    prevPath = `https://www.musiqar.com/uploads/tracks/${prev}`;

    console.log('prev', prevPath);

    this.setState({
      nextPath,
      prevPath,
    });

    this.play(this.props.filepath);

    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState === 'playing' &&
        !this.sliderEditing
      ) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds });
        });
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };

  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };

  onSliderEditing = value => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ playSeconds: value });
    }
  };

  play = async filepath => {
    console.log('If next press', filepath);

    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({ playState: 'playing' });
    } else {
      // const filepath = this.props.filepath;
      console.log('[Play]', filepath);

      this.sound = new Sound(filepath, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
          Alert.alert('Notice', 'audio file error');
          this.setState({ playState: 'paused' });
        } else {
          this.setState({
            playState: 'playing',
            duration: this.sound.getDuration(),
          });
          this.sound.play(this.playComplete);
        }
      });
    }
  };

  playComplete = success => {
    if (this.sound) {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
        Alert.alert('Notice', 'audio file error');
      }
      this.setState({ playState: 'paused', playSeconds: 0 });
      this.sound.setCurrentTime(0);
    }
  };

  pause = () => {
    if (this.sound) {
      console.log('pause');

      this.sound.pause();
    }
    console.log('pause------');

    this.setState({ playState: 'paused' });
  };

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15);
  };

  jumpNext15Seconds = () => {
    this.jumpSeconds(15);
  };

  jumpSeconds = secsDelta => {
    if (this.sound) {
      this.sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
        this.sound.setCurrentTime(nextSecs);
        this.setState({ playSeconds: nextSecs });
      });
    }
  };

  getAudioTimeString = seconds => {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${
      s < 10 ? `0${s}` : s
    }`;
  };

  render() {
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    const durationString = this.getAudioTimeString(this.state.duration);

    console.log('vIndex', this.state.vIndex);

    return (
      <AppView stretch flex backgroundColor="#88302F">
        <AppButton
          leftIcon={<AppIcon name="close" type="ant" size={10} color="white" />}
          onPress={() => {
            AppNavigation.pop();
          }}
          transparent
          margin={5}
        />
        <AppView center stretch flex>
          <AppView stretch row center spaceAround marginBottom={20}>
            <AppIcon
              name="next"
              type="foundation"
              size={10}
              color="white"
              onPress={() => {
                // alert('next');
                console.log('NEXT', this.state.nextPath);
                if (this.sound) {
                  this.sound.release();
                  this.sound = null;
                  this.setState({
                    playState: 'paused',
                    playSeconds: 0,
                    duration: 0,
                  });
                }
                this.sliderEditing = false;

                this.setState({
                  vIndex: this.state.vIndex + 1,
                });
                this.play(
                  `${path}${this.props.allData[this.state.vIndex].name}`,
                );
              }}
            />
            {this.state.playState === 'paused' ? (
              <AppView equalSize={30} center>
                <SpinKit
                  // style={{}}
                  isVisible={this.state.playState === 'paused'}
                  size={50}
                  type="FadingCircleAlt"
                  color="white"
                />
              </AppView>
            ) : (
              <AppImage source={img_speaker} equalSize={30} />
            )}
            {this.state.prevPath !== null && (
              <AppIcon
                name="previous"
                type="foundation"
                size={10}
                color="white"
                onPress={() => {
                  if (
                    this.state.prevPath !==
                      'https://www.musiqar.com/uploads/tracks/false' &&
                    this.state.vIndex > 0
                  ) {
                    if (this.sound) {
                      this.sound.release();
                      this.sound = null;
                      this.setState({
                        playState: 'paused',
                        playSeconds: 0,
                        duration: 0,
                      });
                    }
                    this.sliderEditing = false;

                    this.setState({
                      vIndex: this.state.vIndex - 1,
                    });
                    this.play(
                      `${path}${this.props.allData[this.state.vIndex].name}`,
                    );
                  } else {
                    alert('Last Song');
                  }
                }}
              />
            )}
          </AppView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 15,
            }}
          >
            <TouchableOpacity
              onPress={this.jumpPrev15Seconds}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={img_playjumpleft}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  marginTop: 1,
                  color: 'white',
                  fontSize: 12,
                }}
              >
                15
              </Text>
            </TouchableOpacity>
            {this.state.playState === 'playing' && (
              <TouchableOpacity
                onPress={this.pause}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_pause} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            {this.state.playState === 'paused' && (
              <TouchableOpacity
                onPress={this.play}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_play} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={this.jumpNext15Seconds}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={img_playjumpright}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  marginTop: 1,
                  color: 'white',
                  fontSize: 12,
                }}
              >
                15
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 15,
              flexDirection: 'row',
            }}
          >
            <Text style={{ color: 'white', alignSelf: 'center' }}>
              {currentTimeString}
            </Text>
            <Slider
              onTouchStart={this.onSliderEditStart}
              onTouchEnd={this.onSliderEditEnd}
              onValueChange={this.onSliderEditing}
              value={this.state.playSeconds}
              maximumValue={this.state.duration}
              maximumTrackTintColor="gray"
              minimumTrackTintColor="white"
              thumbTintColor="white"
              style={{
                flex: 1,
                alignSelf: 'center',
                marginHorizontal: Platform.select({ ios: 5 }),
              }}
            />
            <Text style={{ color: 'white', alignSelf: 'center' }}>
              {durationString}
            </Text>
          </View>
        </AppView>
      </AppView>
    );
  }
}
