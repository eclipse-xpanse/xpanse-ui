/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Region } from './Region';
import type { UserAvailableServiceVo } from './UserAvailableServiceVo';

/**
 * List of the registered services group by service version.
 */
export type ProviderOclVo = {
    /**
     * The Cloud Service Provider.
     */
    name: ProviderOclVo.name;
    /**
     * The regions of the Cloud Service Provider.
     */
    regions: Array<Region>;
    /**
     * The list of the available services.
     */
    details: Array<UserAvailableServiceVo>;
};

export namespace ProviderOclVo {
    /**
     * The Cloud Service Provider.
     */
    export enum name {
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
        ALICLOUD = 'alicloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE = 'google',
    }
}
