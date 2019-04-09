import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, RefreshControl, View as NativeView } from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import I18n from 'react-native-i18n';

import View from './View';
import Text from './Text';
import Indicator from './Indicator';
import Button from './Button';
import {
  expResponsiveHeight,
  moderateScale,
  responsiveHeight,
} from './utils/responsiveDimensions';
import { getThemeColor } from './utils/colors';
import { getTheme } from './Theme';
import {
  BasePropTypes,
  dimensionsStyles,
  borderStyles,
  backgroundColorStyles,
  paddingStyles,
  textDirectionStyles,
} from './Base';
import Network from './Base/Network';

class List extends Network {
  static propTypes = {
    ...BasePropTypes,
    ...Network.propTypes,
    columns: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    noResultsLabel: PropTypes.string,
    rowRenderer: PropTypes.func,
    rowHeight: PropTypes.number,
    indicatorColor: PropTypes.string,
    errorLabelColor: PropTypes.string,
    noResultsLabelColor: PropTypes.string,
    retryButtoncolor: PropTypes.string,
    retryButtonBackgroundColor: PropTypes.string,
  };

  static defaultProps = {
    ...Network.defaultProps,
    ...getTheme().list,
    columns: 1,
    data: [],
    rowHeight: 20,
  };

  constructor(props) {
    super(props);

    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2);
    this.mainIndicator = 'loading';
    this.currentFlatListScrollOffset = 0;

    this.state = {
      ...super.state,
      firstFetchDone: !props.apiRequest && !props.firebaseRequest,
      refreshing: false,
      loading: false,
      layoutProvider: null,
      dataProvider: props.flatlist
        ? { _data: props.data }
        : this.dataProvider.cloneWithRows(props.data),
      errorLabel: '',
      layoutReady: false,
    };
  }

  componentDidMount() {
    if (this.props.flatlist) {
      super.componentDidMount();
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    if (nextProps.refreshControl !== this.props.refreshControl) {
      if (this.state.loading) return;
      this.reload();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  setStartFetching() {
    this.setState({
      errorLabel: '',
    });
  }

  setData = (data, cb) => {
    this.setState(
      {
        firstFetchDone: true,
        dataProvider: this.props.flatlist
          ? { _data: data }
          : this.dataProvider.cloneWithRows(data),
      },
      cb,
    );
  };

  setError = errorLabel => {
    this.setState({
      firstFetchDone: true,
      errorLabel,
    });
  };

  setEndFetching = () => {
    this.setState({
      refreshing: false,
      loading: false,
    });
  };

  addItemToList = item => {
    const { _data } = this.state.dataProvider;

    const newData = [..._data, item];

    this.setData(newData);
  };

  removeItemFromList = id => {
    const { _data } = this.state.dataProvider;

    const index = _data.findIndex(
      item => Object.getDeepProp(item, this.props.idPathInData) === id,
    );

    const newData = [..._data.slice(0, index), ..._data.slice(index + 1)];

    this.setData(newData);
  };

  updateItemInList = (id, changedData, changedDataCB = () => {}) => {
    const { _data } = this.state.dataProvider;

    const index = _data.findIndex(
      item => Object.getDeepProp(item, this.props.idPathInData || 'id') === id,
    );

    _data[index] = {
      ..._data[index],
      ...changedData,
      ...changedDataCB(_data[index]),
    };
    this.setData(_data);
  };

  handleParentViewLayout = e => {
    if (this.state.layoutReady) return;

    if (this.props.flatlist) {
      this.setState({
        layoutReady: true,
      });
    } else {
      const { width } = e.nativeEvent.layout;

      if (width < 1) return;

      this.setState({
        layoutReady: true,
        layoutProvider: new LayoutProvider(
          () => 1,
          (type, dim) => {
            dim.width = width / this.props.columns;
            dim.height = moderateScale(this.props.rowHeight, 0.2);
          },
        ),
      });
    }
  };

  renderFooter = () => {
    if (this.state.refreshing) return null;

    if (this.state.errorLabel) {
      return (
        <View centerX p={10}>
          <Text bold color={this.props.errorLabelColor}>
            {this.state.errorLabel}
          </Text>
          <Button
            title={I18n.t('ui-retry')}
            backgroundColor={this.props.retryButtonBackgroundColor}
            color={this.props.retryButtoncolor}
            mv={8}
            onPress={() => {
              this.setState({
                errorLabel: '',
              });
              this.reload();
            }}
            processing={this.state.refreshing}
            size={7.5}
            ph={10}
          />
        </View>
      );
    }

    if (
      this.state.dataProvider._data.length === 0 &&
      !this.state.loading &&
      this.state.firstFetchDone
    ) {
      if (this.props.noResultsComponent) {
        return React.cloneElement(this.props.noResultsComponent);
      }
      return (
        <View centerX p={15}>
          <Text bold color={this.props.noResultsLabelColor}>
            {this.props.noResultsLabel || I18n.t('ui-noResultsFound')}
          </Text>
        </View>
      );
    }

    return null;
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 100; // Distance from the bottom you want it to trigger.
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  renderFlatListLoadingIndicator = () => {
    if (this.page > this.pageCount && !this.loading) {
      return null;
    }

    return (
      <View centerX p={4} marginBottom={5}>
        <Indicator color={this.props.indicatorColor} size={12} />
      </View>
    );
  };

  renderFlatListItem = ({ item, index }) => {
    if (index == this.state.dataProvider._data.length) {
      return this.renderFlatListLoadingIndicator();
    }
    return React.cloneElement(this.props.rowRenderer(item), {
      addItemToList: this.addItemToList,
      updateItemInList: this.updateItemInList,
      removeItemFromList: this.removeItemFromList,
    });
  };

  onFlatListScroll = ({ nativeEvent }) => {
    const currentOffset = nativeEvent.contentOffset.y;
    const direction =
      currentOffset > this.currentFlatListScrollOffset ? 'down' : 'up';
    this.currentFlatListScrollOffset = currentOffset;

    if (this.props.onScroll) this.props.onScroll({ nativeEvent });

    if (direction === 'up' || this.loading) return;

    if (this.isCloseToBottom(nativeEvent)) {
      if (this.page <= this.pageCount) {
        this.fetch('loading');
      }
    }
  };

  renderFlatList = () => (
    <FlatList
      numColumns={this.props.columns}
      horizontal={false}
      // removeClippedSubviews
      // getItemLayout={(data, index) => ({
      //   length: 70,
      //   offset: 70 * index,
      //   index,
      // })}
      initialNumToRender={27}
      maxToRenderPerBatch={30}
      contentContainerStyle={
        this.props.columns > 1
          ? {
              flex: 1,
              flexDirection: this.props.rtl ? 'row-reverse' : 'row',
              flexWrap: 'wrap',
              justifyContent: this.state.loading ? 'center' : 'space-between',
            }
          : {}
      }
      data={[...this.state.dataProvider._data, {}]}
      keyExtractor={(item, index) => String(index)}
      renderItem={this.renderFlatListItem}
      onScroll={this.onFlatListScroll}
      scrollEventThrottle={1000}
      ListFooterComponent={this.renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={() => {
            if (this.props.onRefresh) {
              this.props.onRefresh();
            }
            this.fetch('refreshing', true);
          }}
          colors={[getThemeColor(this.props.indicatorColor)]}
          tintColor={getThemeColor(this.props.indicatorColor)}
        />
      }
    />
  );

  renderRecyclerListView = () => (
    <RecyclerListView
      layoutProvider={this.state.layoutProvider}
      dataProvider={this.state.dataProvider}
      rowRenderer={(type, data) =>
        React.cloneElement(this.props.rowRenderer(data), {
          updateItemInList: this.updateItemInList,
        })
      }
      onScroll={this.props.onScroll}
      contentContainerStyle={[paddingStyles(this.props)]}
      renderFooter={this.renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.fetch('refreshing', true);
            if (this.props.onRefresh) {
              this.props.onRefresh();
            }
          }}
          colors={[getThemeColor(this.props.indicatorColor)]}
          tintColor={getThemeColor(this.props.indicatorColor)}
        />
      }
    />
  );

  render() {
    return (
      <NativeView
        style={[
          dimensionsStyles(this.props),
          backgroundColorStyles(this.props),
          {
            alignSelf: 'stretch',
            flex: this.props.height ? undefined : 1,
          },
          borderStyles(this.props),
        ]}
        onLayout={this.handleParentViewLayout}
      >
        {this.state.layoutReady
          ? this.props.flatlist
            ? this.renderFlatList()
            : this.renderRecyclerListView()
          : null}
      </NativeView>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(List);
