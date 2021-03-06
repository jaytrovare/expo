/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule renderApplication
 * @format
 * @flow
 */

'use strict';

const AppContainer = require('./AppContainer');
const React = require('react');
const ReactNative = require('../Renderer/shims/ReactNative');

const invariant = require('fbjs/lib/invariant');

// require BackHandler so it sets the default handler that exits the app if no listeners respond
require('../Utilities/BackHandler');

function renderApplication<Props: Object>(
  RootComponent: React.ComponentType<Props>,
  initialProps: Props,
  rootTag: any,
  WrapperComponent?: ?React.ComponentType<*>,
) {
  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  let renderable = (
    <AppContainer rootTag={rootTag} WrapperComponent={WrapperComponent}>
      <RootComponent {...initialProps} rootTag={rootTag} />
    </AppContainer>
  );

  // If the root component is async, the user probably wants the initial render
  // to be async also. To do this, wrap AppContainer with an async marker.
  // For more info see https://fb.me/is-component-async
  if (
    RootComponent.prototype != null &&
    RootComponent.prototype.unstable_isAsyncReactComponent === true
  ) {
    // $FlowFixMe This is not yet part of the official public API
    const AsyncMode = React.unstable_AsyncMode;
    renderable = <AsyncMode>{renderable}</AsyncMode>;
  }

  ReactNative.render(renderable, rootTag);
}

module.exports = renderApplication;
