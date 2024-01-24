/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
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
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
        SCS = 'scs',
        ALICLOUD = 'alicloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE = 'google',
    }
}
