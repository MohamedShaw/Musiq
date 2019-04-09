import { BackHandler, Platform } from 'react-native';
import { Navigation as NativeNavigation } from 'react-native-navigation';

let INITED = false;

class Navigation {
  static menuComponentId = 0;

  static lastCommand = '';

  static modalIsOn = false;

  static currentScreen = '';

  static prevScreen = '';

  constructor() {
    throw new Error('Cannot construct singleton');
  }

  static getScreenLayout = layout => {
    // cosnt screenName = '';

    if (typeof layout === 'string') {
      return {
        component: {
          name: layout,
        },
      };
    }
    if (typeof layout === 'object') {
      return {
        component: {
          name: layout.name,
          passProps: layout.passProps,
        },
      };
    }
  };

  static getBottomTabsLayout = layout => {
    if (typeof layout !== 'object') return null;
    if (!layout.bottomTabs) return null;

    const children = layout.bottomTabs.map(tab => ({
      component: {
        name: tab.screen,
        passProps: tab.passProps,
        options: {
          bottomTab: {
            text: tab.label,
            icon: tab.icon,
          },
        },
      },
    }));

    return {
      bottomTabs: {
        children,
      },
    };
  };

  static getSideMenuLayout = layout => {
    if (typeof layout !== 'object') return null;
    if (!layout.sideMenu) return null;

    const menu = {};

    if (typeof layout.rtl === 'boolean') {
      if (layout.rtl) {
        menu.right = {
          component: { name: layout.sideMenu },
        };
        Navigation.menuDirection = 'right';
      } else {
        menu.left = {
          component: { name: layout.sideMenu },
        };
        Navigation.menuDirection = 'left';
      }
    } else if (Navigation.menuDirection) {
      if (Navigation.menuDirection === 'right') {
        menu.right = {
          component: { name: layout.sideMenu },
        };
      } else if (Navigation.menuDirection === 'left') {
        menu.left = {
          component: { name: layout.sideMenu },
        };
      }
    }

    Navigation.menuComponentId += 1;

    const MainLayout = layout.bottomTabs
      ? Navigation.getBottomTabsLayout(layout)
      : Navigation.getScreenLayout(layout);

    return {
      sideMenu: {
        id: `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        center: {
          stack: {
            children: [{ ...MainLayout }],
          },
        },
        ...menu,
      },
    };
  };

  static init = (initialStack, layout) => {
    if (!INITED) {
      this.initialStack = initialStack;
      this.currentStack = initialStack;
      this.mainLayout = null;
      this.mainStack = initialStack;

      BackHandler.addEventListener('hardwareBackPress', async () => {
        try {
          await Navigation.pop();
        } catch (error) {
          BackHandler.exitApp();
          return false;
        }

        return true;
      });

      NativeNavigation.events().registerComponentDidAppearListener(
        ({ componentId, componentName }) => {
          Navigation.currentScreen = componentName;
          this.currentComponentId = componentId;
        },
      );

      NativeNavigation.events().registerComponentDidDisappearListener(
        ({ componentName }) => {
          Navigation.prevScreen = componentName;
        },
      );

      NativeNavigation.events().registerCommandCompletedListener(
        ({ commandId }) => {
          Navigation.lastCommand = commandId.replace(/[0-9]/g, '');

          if (Navigation.lastCommand === 'showModal') {
            Navigation.modalIsOn = true;
          } else if (
            Navigation.lastCommand === 'dismissModal' ||
            Navigation.lastCommand === 'dismissAllModals'
          ) {
            Navigation.modalIsOn = false;
          }
        },
      );
    }

    this.mainLayoutRaw = layout;
    this.mainLayout = Navigation.getLayout(layout);

    NativeNavigation.setRoot({
      root: {
        stack: {
          id: initialStack,
          children: [this.mainLayout],
        },
      },
    });

    INITED = true;
  };

  // if setMainLayout = true, layout must be defined
  static setStackRoot = (layout, stack, setMainLayout) => {
    try {
      if (setMainLayout && !layout) {
        throw new Error('Navigation.setStackRoott() ERROR');
      }
    } catch (error) {
      console.log(error);
      return;
    }

    const newLayout = layout
      ? Navigation.getLayout(layout)
      : Navigation.getLayout(this.mainLayoutRaw);

    if (setMainLayout) {
      this.mainLayoutRaw = layout;
      this.mainLayout = newLayout;
    }

    NativeNavigation.setStackRoot(stack || this.mainStack, newLayout);
  };

  static getLayout = layout =>
    Navigation.getSideMenuLayout(layout) ||
    Navigation.getBottomTabsLayout(layout) ||
    Navigation.getScreenLayout(layout);

  static push = async layout => {
    if (layout.bottomTabs) {
      await NativeNavigation.push('MAIN_STACK', Navigation.getLayout(layout));
      return;
    }
    const screenName = typeof layout === 'string' ? layout : layout.name;
    const passProps = typeof layout === 'string' ? {} : layout.passProps;
    const stackName = typeof layout === 'object' ? layout.stackName : null;

    if (screenName === Navigation.currentScreen) return;

    if (stackName) {
      await NativeNavigation.showModal({
        stack: {
          id: stackName,
          children: [
            {
              component: {
                name: screenName,
                passProps,
              },
            },
          ],
        },
      });
      Navigation.currentScreen = screenName;
      this.currentStack = stackName;
    } else {
      const componentId =
        Platform.OS === 'ios'
          ? this.currentComponentId || this.currentStack
          : this.currentStack;

      await NativeNavigation.push(componentId, {
        component: {
          name: screenName,
          passProps,
        },
      });
      Navigation.currentScreen = screenName;
    }
  };

  static pop = async () => {
    const componentId =
      Platform.OS === 'ios'
        ? this.currentComponentId || this.currentStack
        : this.currentStack;

    if (Navigation.modalIsOn) {
      NativeNavigation.dismissAllModals();
      return;
    }

    try {
      await NativeNavigation.pop(componentId);
    } catch (error) {
      console.log(error);

      if (Navigation.modalIsOn) {
        this.currentStack = this.initialStack;
        NativeNavigation.dismissAllModals();
      } else {
        throw error;
      }
    }
  };

  static showModal = layout => {
    const resolvedLayout = Navigation.getLayout(layout);

    NativeNavigation.showModal({
      stack: {
        children: [resolvedLayout],
      },
    });
  };

  static dismissBranchStack = async () => {
    await NativeNavigation.dismissAllModals();
  };

  static dismissAllModal = async () => {
    await NativeNavigation.dismissAllModals();
  };

  static openMenu = () => {
    if (Navigation.menuDirection === 'right') {
      NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            right: {
              visible: true,
            },
          },
        },
      );
    } else if (Navigation.menuDirection === 'left') {
      NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            left: {
              visible: true,
            },
          },
        },
      );
    }
  };

  static closeMenu = () => {
    if (Navigation.menuDirection === 'right') {
      NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            right: {
              visible: false,
            },
          },
        },
      );
    } else if (Navigation.menuDirection === 'left') {
      NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            left: {
              visible: false,
            },
          },
        },
      );
    }
  };

  static enableMenu = async () => {
    if (Navigation.menuDirection === 'left') {
      await NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            left: {
              enabled: true,
            },
          },
        },
      );
    } else if (Navigation.menuDirection === 'right') {
      await NativeNavigation.mergeOptions(
        `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
        {
          sideMenu: {
            right: {
              enabled: true,
            },
          },
        },
      );
    }
  };

  static disableMenu = async () => {
    await NativeNavigation.mergeOptions(
      `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
      {
        sideMenu: {
          right: {
            visible: false,
            enabled: false,
          },
        },
      },
    );

    await NativeNavigation.mergeOptions(
      `MAIN_SIDE_MENU${Navigation.menuComponentId}`,
      {
        sideMenu: {
          left: {
            visible: false,
            enabled: false,
          },
        },
      },
    );
  };
}

export default Navigation;
