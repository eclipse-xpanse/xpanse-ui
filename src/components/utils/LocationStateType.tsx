/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { serviceDeploymentState } from '../../xpanse-api/generated';

export interface LocationStateType {
    from?: string;
    serviceDeploymentStates?: serviceDeploymentState[] | null;
    serviceIds?: string[] | null;
}
