/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { deployResourceKind } from '../../../../xpanse-api/generated';

export interface DeployResourceDataType {
    key: React.Key;
    resourceKind: deployResourceKind;
    resourceId: string;
    resourceName: React.JSX.Element;
}
