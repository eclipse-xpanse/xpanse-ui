/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
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
     * The regions of the Cloud Service Provider. The list elements must be unique.
     */
    regions: Array<Region>;
};
export namespace CloudServiceProvider {
    /**
     * The Cloud Service Provider.
     */
    export enum name {
        HUAWEI_CLOUD = 'HuaweiCloud',
        FLEXIBLE_ENGINE = 'FlexibleEngine',
        OPENSTACK_TESTLAB = 'OpenstackTestlab',
        PLUS_SERVER = 'PlusServer',
        REGIO_CLOUD = 'RegioCloud',
        ALIBABA_CLOUD = 'AlibabaCloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE_CLOUD_PLATFORM = 'GoogleCloudPlatform',
    }
}
