/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VersionOclVo } from './VersionOclVo';

export type CategoryOclVo = {
    /**
     * Name of the registered service.
     */
    name: string;
    /**
     * List of the registered service group by service version.
     */
    versions: Array<VersionOclVo>;
};
