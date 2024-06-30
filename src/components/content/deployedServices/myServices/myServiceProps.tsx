/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { deployResourceKind } from '../../../../xpanse-api/generated';

export interface DeployResourceDataType {
    key: React.Key;
    resourceType: deployResourceKind;
    resourceId: string;
    name: React.JSX.Element;
}
