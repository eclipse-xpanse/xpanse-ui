/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ModifyRequest } from '../../../../xpanse-api/generated';

export interface ModifySubmitRequest {
    id: string;
    modifyRequest: ModifyRequest;
}
