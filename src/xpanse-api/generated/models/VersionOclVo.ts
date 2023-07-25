/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProviderOclVo } from './ProviderOclVo';

/**
 * List of the registered service group by service version.
 */
export type VersionOclVo = {
    /**
     * Version of the registered service.
     */
    version: string;
    /**
     * List of the registered services group by service version.
     */
    cloudProvider: Array<ProviderOclVo>;
};
