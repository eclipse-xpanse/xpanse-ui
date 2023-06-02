/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Region } from './Region';

/**
 * The cloud service provider of the managed service
 */
export type CloudServiceProvider = {
    /**
     * The Cloud Service Provider.
     */
    name: CloudServiceProvider.name;
    /**
     * The regions of the Cloud Service Provider
     */
    regions: Array<Region>;
};

export namespace CloudServiceProvider {
    /**
     * The Cloud Service Provider.
     */
    export enum name {
        AWS = 'aws',
        AZURE = 'azure',
        ALICLOUD = 'alicloud',
        HUAWEI = 'huawei',
        OPENSTACK = 'openstack',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        GOOGLE = 'google',
    }
}
