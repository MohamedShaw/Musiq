import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View as NativeView,
  StyleSheet,
  ViewPagerAndroid,
  Animated,
  Platform,
  InteractionManager,
  Dimensions,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

import DefaultTabBar from './DefaultTabBar';
import { responsiveWidth } from '.';

const AnimatedViewPagerAndroid = Animated.createAnimatedComponent(
  ViewPagerAndroid,
);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const styles = StyleSheet.create({
  full: {
    flex: 1,
    alignSelf: 'stretch',
  },
  rtl: {
    transform: [{ scaleX: -1 }],
  },
});

// TODO REFACTORING
class Tabs extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    customTabBar: PropTypes.node,
    scrollable: PropTypes.bool,
    locked: PropTypes.bool,
    initialPage: PropTypes.number,
  };

  static defaultProps = {
    scrollable: true,
    initialPage: 0,
  };

  constructor(props) {
    super(props);

    const w = Dimensions.get('window').width;

    let scrollValue;
    let scrollXIOS;
    let positionAndroid;
    let offsetAndroid;

    if (Platform.OS === 'ios') {
      scrollXIOS = new Animated.Value(
        this.props.initialPage * responsiveWidth(100),
      );
      const containerWidthAnimatedValue = new Animated.Value(
        responsiveWidth(100),
      );
      // Need to call __makeNative manually to avoid a native animated bug. See
      // https://github.com/facebook/react-native/pull/14435
      containerWidthAnimatedValue.__makeNative();
      scrollValue = Animated.divide(scrollXIOS, containerWidthAnimatedValue);
      const callListeners = this._polyfillAnimatedValue(scrollValue);
      scrollXIOS.addListener(({ value }) =>
        callListeners(value / this.state.containerWidth),
      );
    } else {
      positionAndroid = new Animated.Value(props.initialPage);
      offsetAndroid = new Animated.Value(0);
      scrollValue = Animated.add(positionAndroid, offsetAndroid);

      const callListeners = this._polyfillAnimatedValue(scrollValue);
      let positionAndroidValue = props.initialPage;
      let offsetAndroidValue = 0;
      positionAndroid.addListener(({ value }) => {
        positionAndroidValue = value;
        callListeners(positionAndroidValue + offsetAndroidValue);
      });
      offsetAndroid.addListener(({ value }) => {
        offsetAndroidValue = value;
        callListeners(positionAndroidValue + offsetAndroidValue);
      });
    }

    this.state = {
      activePage: props.initialPage,
      containerWidth: 0,
      containerHeight: 0,
      ready: false,
      parentContainerWidth: 0,
      parentContainerHeight: 0,
      parentReady: false,
      positionAndroid,
      offsetAndroid,
      scrollXIOS,
      scrollValue,
    };

    this.scrollRef = React.createRef();
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.state.scrollXIOS.removeAllListeners();
    } else {
      this.state.positionAndroid.removeAllListeners();
      this.state.offsetAndroid.removeAllListeners();
    }
  }

  getTabsInfo = () =>
    this.props.children.map((child, index) => ({
      label: child.props.tabLabel,
      page: index,
    }));

  goToPage = (page, animated = true) => {
    this.setState({
      activePage: page,
    });

    if (this.props.scrollable) {
      if (Platform.OS === 'ios') {
        this.scrollRef.current.getNode().scrollTo({
          x: this.state.containerWidth * page,
          y: 0,
          animated,
        });
      } else {
        this.scrollRef.current.getNode().setPage(page);
      }
    }
  };

  _polyfillAnimatedValue = animatedValue => {
    const listeners = new Set();
    const addListener = listener => {
      listeners.add(listener);
    };

    const removeListener = listener => {
      listeners.delete(listener);
    };

    const removeAllListeners = () => {
      listeners.clear();
    };

    animatedValue.addListener = addListener;
    animatedValue.removeListener = removeListener;
    animatedValue.removeAllListeners = removeAllListeners;

    return value => listeners.forEach(listener => listener({ value }));
  };

  _onMomentumScrollBeginAndEnd = e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / this.state.containerWidth);

    if (this.state.activePage !== page) {
      this.setState({
        activePage: page,
      });
    }
  };

  _onScroll = e => {
    if (Platform.OS === 'ios') {
      // const offsetX = e.nativeEvent.contentOffset.x;
      // if (offsetX === 0 && !this.scrollOnMountCalled) {
      //   this.scrollOnMountCalled = true;
      // } else {
      //   this.props.onScroll(offsetX / this.state.containerWidth);
      // }
    } else {
      const { position, offset } = e.nativeEvent;
      if (this.props.onScroll) {
        this.props.onScroll(position + offset);
      }
    }
  };

  handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;

    if (!width || !height || width <= 0 || height <= 0) {
      return;
    }

    this.setState({
      containerWidth: width,
      containerHeight: height,
      ready: true,
    });

    InteractionManager.runAfterInteractions(() => {
      if (this.props.scrollable) {
        if (Platform.OS === 'android') {
          this.scrollRef.current
            .getNode()
            .setPageWithoutAnimation(this.props.initialPage);
        } else {
          // IOS
          // TODO goto initial page
        }
      }
    });
  };

  handleLayoutParent = e => {
    const { width, height } = e.nativeEvent.layout;

    if (!width || !height || width <= 0 || height <= 0) {
      return;
    }

    this.setState({
      parentContainerWidth: width,
      parentContainerHeight: height,
      parentReady: true,
    });

    if (Platform.OS === 'ios') {
      const containerWidthAnimatedValue = new Animated.Value(width);
      // Need to call __makeNative manually to avoid a native animated bug. See
      // https://github.com/facebook/react-native/pull/14435
      containerWidthAnimatedValue.__makeNative();
      const scrollValue = Animated.divide(
        this.state.scrollXIOS,
        containerWidthAnimatedValue,
      );
      this.setState({ containerWidth: width, scrollValue });
    } else {
      this.setState({ containerWidth: width });
    }
    // this.requestAnimationFrame(() => {
    //   this.goToPage(this.state.currentPage);
    // });
  };

  renderTabBar = tabBar =>
    React.cloneElement(tabBar, {
      tabs: this.getTabsInfo(),
      activePage: this.state.activePage,
      goToPage: this.goToPage,
      containerWidth: this.state.parentContainerWidth,
      scrollValue: this.state.scrollValue,
    });

  renderPage = (page, index) => (
    <NativeView
      key={String(index)}
      style={[
        {
          width: this.state.containerWidth,
          height: this.state.containerHeight,
        },
        styles.rtl,
      ]}
    >
      {React.cloneElement(page, {
        activePage: this.state.activePage,
        goToPage: this.goToPage,
      })}
    </NativeView>
  );

  renderScrollableContentAndroid = () => {
    const { children, rtl } = this.props;

    return (
      <AnimatedViewPagerAndroid
        onLayout={this.handleLayout}
        style={[styles.full, rtl ? styles.rtl : null]}
        keyboardDismissMode="on-drag"
        scrollEnabled={!this.props.locked}
        ref={this.scrollRef}
        onPageSelected={e => {
          this.setState({
            activePage: e.nativeEvent.position,
          });
        }}
        onPageScroll={Animated.event(
          [
            {
              nativeEvent: {
                position: this.state.positionAndroid,
                offset: this.state.offsetAndroid,
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: this._onScroll,
          },
        )}
      >
        {this.state.ready
          ? children.map((child, index) => this.renderPage(child, index))
          : null}
      </AnimatedViewPagerAndroid>
    );
  };

  renderScrollableContentIOS = () => {
    const { children, rtl } = this.props;

    return (
      <AnimatedScrollView
        ref={this.scrollRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: this.state.scrollXIOS } } }],
          { useNativeDriver: true, listener: this._onScroll },
        )}
        contentOffset={{
          x: this.props.initialPage * this.state.containerWidth,
        }}
        horizontal
        pagingEnabled
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        scrollsToTop={false}
        onMomentumScrollBegin={this._onMomentumScrollBeginAndEnd}
        onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}
        scrollEventThrottle={16}
        scrollEnabled={!this.props.locked}
        alwaysBounceVertical={false}
        keyboardDismissMode="on-drag"
        onLayout={this.handleLayout}
        style={[styles.full, rtl ? styles.rtl : null]}
      >
        {this.state.ready
          ? children.map((child, index) => this.renderPage(child, index))
          : null}
      </AnimatedScrollView>
    );
  };

  render() {
    return (
      <NativeView style={styles.full} onLayout={this.handleLayoutParent}>
        {this.state.parentReady
          ? this.renderTabBar(this.props.customTabBar || <DefaultTabBar />)
          : null}
        {this.props.scrollable ? (
          Platform.OS === 'ios' ? (
            this.renderScrollableContentIOS()
          ) : (
            this.renderScrollableContentAndroid()
          )
        ) : (
          <NativeView style={styles.full} onLayout={this.handleLayout}>
            {this.state.ready
              ? this.renderPage(this.props.children[this.state.activePage])
              : null}
          </NativeView>
        )}
      </NativeView>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(Tabs);
