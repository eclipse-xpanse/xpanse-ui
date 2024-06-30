/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AutoFill } from '../../../../xpanse-api/generated';

export interface DeployParam {
    name: string;
    kind: string;
    type: string;
    example: string;
    description: string;
    value: string;
    mandatory: boolean;
    sensitiveScope: string;
    valueSchema: Record<string, unknown> | undefined;
    autoFill: AutoFill | undefined;
}
