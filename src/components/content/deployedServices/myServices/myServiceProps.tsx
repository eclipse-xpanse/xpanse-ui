/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';

export interface DeployResourceDataType {
    key: React.Key;
    resourceType: string;
    resourceId: string;
    name: React.JSX.Element;
}
