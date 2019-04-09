import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import Axois from 'axios';
import {
  AppButton,
  moderateScale,
  AppIcon,
  AppView,
  AppScrollView,
  AppText,
  AppSpinner,
  getColors,
} from '../../common';
import cover from '../../assets/imgs/cover.png';
import { AppHeader, ProductCard } from '../../component';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: true,
      errors: false,
    };
  }

  componentDidMount() {
    this.onHandleRequest();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, loading: false });
    this.onHandleRequest().then(() => {
      this.setState({ refreshing: false });
    });
  };

  onHandleRequest = async () => {
    try {
      const response = await Axois.post(
        `https://www.breadfast.com/wp-json/breadfast/testing/products/`,
        {
          headers: {
            Authorization: {
              token: '3f2o3hf2ougo2gbvg3lgb3lqpi1321d',
            },
          },
        },
      );

      this.setState({
        loading: false,
        products: response.data.data,
      });

      console.log('RESSS', response);
    } catch (error) {
      this.setState({
        loading: false,
        errors: true,
      });
      alert('حاول مره اخري');

      console.log('ERR', JSON.parse(JSON.stringify(error)));
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.onHandleRequest().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    return (
      <AppView stretch flex>
        <AppHeader title="Products" cart hideBack />
        {this.state.loading ? (
          <AppView stretch center flex>
            <AppSpinner size={15} color="primary" />
          </AppView>
        ) : this.state.errors ? (
          <AppView stretch flex center>
            <AppText>Some Thing Wronge</AppText>
          </AppView>
        ) : (
          <AppScrollView
            stretch
            center
            flex
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                colors={[getColors().primary]}
              />
            }
          >
            {this.state.products.map((i, index) => (
              <>
                <AppView
                  stretch
                  key={index}
                  marginHorizontal={5}
                  marginTop={15}
                  left
                >
                  <AppText bold>{i.name}</AppText>
                  <AppText>{i.products.length}</AppText>
                </AppView>

                <FlatList
                  data={i.products}
                  renderItem={({ item }) => <ProductCard data={item} />}
                  numColumns={2}
                  horizontal={false}
                  keyExtractor={i.products.id}
                />
              </>
            ))}
          </AppScrollView>
        )}
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.location.current,
  cart: state.shoppingCart.cart,
});

export default connect(
  mapStateToProps,
  null,
)(ProductList);
