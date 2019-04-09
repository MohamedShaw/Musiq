import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView as NativeScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import {
  BasePropTypes,
  dimensionsStyles,
  selfLayoutStyles,
  childrenLayoutStyles,
  backgroundColorStyles,
  paddingStyles,
  marginStyles,
  borderStyles,
} from './Base';

const styles = StyleSheet.create({
  rtl: {
    transform: [{ scaleX: -1 }],
  },
});

class ScrollView extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
    horizontal: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  render() {
    const { horizontal, flattenChildren, flexGrow, rtl, ...rest } = this.props;
    let { children } = this.props;
    if (children && !Array.isArray(children)) {
      children = [children];
    }

    if (flattenChildren) {
      children = children.reduce((acc, item) => acc.concat(item), []);
    }

    return (
      <NativeScrollView
        ref={this.ref}
        {...rest}
        horizontal={horizontal}
        right={null}
        left={null}
        flex={null}
        style={[
          dimensionsStyles(this.props),
          selfLayoutStyles(this.props),
          backgroundColorStyles(this.props),
          borderStyles(this.props),
          marginStyles({ ...this.props, row: horizontal }),
          rtl && horizontal ? styles.rtl : null,
        ]}
        contentContainerStyle={[
          !horizontal && childrenLayoutStyles(this.props),
          paddingStyles({ ...this.props, row: horizontal }),
          flexGrow && { flexGrow: 1 },
        ]}
      >
        {React.Children.map(children, child =>
          child
            ? React.cloneElement(child, {
                style: [
                  Object.getDeepProp(child, 'props.style'),
                  rtl && horizontal ? styles.rtl : {},
                ],
              })
            : child,
        )}
      </NativeScrollView>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)(ScrollView);
