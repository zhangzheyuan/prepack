/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow */

import type { Realm } from "../../realm.js";
import { ObjectValue, StringValue, AbstractValue, BooleanValue } from "../../values/index.js";
import { thisBooleanValue } from "../../methods/to.js";
import buildExpressionTemplate from "../../utils/builder.js";

export default function(realm: Realm, obj: ObjectValue): void {
  // ECMA262 19.3.1
  obj.$BooleanData = realm.intrinsics.false;

  const tsTemplateSrc = "(A).toString()";
  const tsTemplate = buildExpressionTemplate(tsTemplateSrc);

  // ECMA262 19.3.3.3
  obj.defineNativeMethod("toString", 0, context => {
    const target = context instanceof ObjectValue ? context.$BooleanData : context;
    if (target instanceof AbstractValue && target.getType() === BooleanValue) {
      return AbstractValue.createFromTemplate(realm, tsTemplate, StringValue, [target], tsTemplateSrc);
    }
    // 1. Let b be ? thisBooleanValue(this value).
    let b = thisBooleanValue(realm, context);

    // 2. If b is true, return "true"; else return "false".
    return new StringValue(realm, b.value ? "true" : "false");
  });

  // ECMA262 19.3.3.4
  obj.defineNativeMethod("valueOf", 0, context => {
    // 1. Return ? thisBooleanValue(this value).
    return thisBooleanValue(realm, context);
  });
}
