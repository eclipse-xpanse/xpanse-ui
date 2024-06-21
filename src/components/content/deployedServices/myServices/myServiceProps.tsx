/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployResource } from '../../../../xpanse-api/generated';

export interface DeployResourceDataType {
    key: React.Key;
    resourceType: DeployResource['kind'];
    resourceId: string;
    name: React.JSX.Element;
}
