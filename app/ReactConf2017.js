// @flow
import React, { Component } from 'react';
import { Navigator } from 'react-native-deprecated-custom-components';
import { AppState, StatusBar, StyleSheet } from 'react-native';
import codePush from 'react-native-code-push';

import theme from './theme';
import { Info, Schedule, Talk } from './scenes';
const Scenes = { Info, Schedule, Talk };

const DEFAULT_VIEW = 'Schedule';

class ReactConf2017 extends Component {
  componentDidMount() {
    this.syncAppVersion();
    StatusBar.setBarStyle('light-content', true);
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (currentAppState: string) => {
    if (currentAppState === 'active') {
      this.syncAppVersion();
    }
  };

  syncAppVersion = () => {
    codePush.sync({ mandatoryInstallMode: codePush.InstallMode.IMMEDIATE });
  };

  render() {
    const renderScene = (route, navigator) => {
      const SceneComponent = Scenes[route.scene]; // either Info, Schedule (default) or Talk
      return <SceneComponent {...route.props} navigator={navigator} />;
    };

    const configureScene = route => {
      const TRANSITION_KEYS = Object.keys(Navigator.SceneConfigs);
      if (
        route.transitionKey && !TRANSITION_KEYS.includes(route.transitionKey)
      ) {
        console.warn(
          'Warning: Invalid transition key `' +
            route.transitionKey +
            '` supplied to `Navigator`. Valid keys: [\n' +
            TRANSITION_KEYS.join('\n') +
            '\n]'
        );
        return Navigator.SceneConfigs.PushFromRight; // use default transition key if the transition key specified by a route can't be found
      }

      return route.transitionKey
        ? Navigator.SceneConfigs[route.transitionKey] // if route specifies one transition key (FloatFromRight, FloatFromRight, FloatFromLeft..etc ), use it;
        : {
            ...Navigator.SceneConfigs.PushFromRight, // otherwise , use default + swipe gensture
            gestures: route.enableSwipeToPop
              ? {
                  /**
                 * this.props.navigator.push({
                    enableSwipeToPop: true,
                    scene: 'Info',
                  });
                 */
                  pop: Navigator.SceneConfigs.PushFromRight.gestures.pop,
                }
              : null,
          };
    };

    return (
      <Navigator
        configureScene={configureScene /*transition settings only*/}
        renderScene={renderScene}
        initialRoute={{ scene: DEFAULT_VIEW, index: 0 }}
        sceneStyle={rawStyles.scenes}
        style={styles.navigator}
      />
    );
  }
}

const rawStyles = {
  scenes: {
    backgroundColor: theme.color.sceneBg,
    overflow: 'visible',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.33,
    shadowRadius: 5,
  },
};

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: 'black',
    flex: 1,
  },
});

module.exports = ReactConf2017;
