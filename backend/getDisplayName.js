/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const FB_MODULE_RE = /^(.*) \[from (.*)\]$/;
const cachedDisplayNames = new WeakMap();

function getDisplayName(type: Function): string {
  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  let displayName = type.displayName || type.name;

  // The displayName property might not be a string.
  // If it's a custom function, attempt to use its return value.
  // github.com/facebook/react-devtools/issues/803
  if (typeof displayName === 'function') {
    try {
      displayName = displayName();
    } catch (error) {}
  }

  // If we haven't got a display name (or we have an invalid one)
  // Fall back to a safe value, 'Unknown'.
  if (!displayName || typeof displayName !== 'string') {
    displayName = 'Unknown';
  }

  // Facebook-specific hack to turn "Image [from Image.react]" into just "Image".
  // We need displayName with module name for error reports but it clutters the DevTools.
  const match = displayName.match(FB_MODULE_RE);
  if (match) {
    const componentName = match[1];
    const moduleName = match[2];
    if (componentName && moduleName) {
      if (
        moduleName === componentName ||
        moduleName.startsWith(componentName + '.')
      ) {
        displayName = componentName;
      }
    }
  }

  cachedDisplayNames.set(type, displayName);
  return displayName;
}

module.exports = getDisplayName;
