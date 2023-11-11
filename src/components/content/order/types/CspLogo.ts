/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServiceProvider } from '../../../../xpanse-api/generated';
import {
    AlibabaLogo,
    AWSLogo,
    AzureLogo,
    FlexibleEngineLogo,
    GoogleLogo,
    HuaWeiLogo,
    OpenStackLogo,
    ScsLogo,
} from '../formElements/CspLogo';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

export const cspMap = new Map<CloudServiceProvider.name, CSP>([
    [CloudServiceProvider.name.HUAWEI, { name: 'Huawei', logo: HuaWeiLogo }],
    [CloudServiceProvider.name.AZURE, { name: 'Azure', logo: AzureLogo }],
    [CloudServiceProvider.name.ALICLOUD, { name: 'Alibaba', logo: AlibabaLogo }],
    [CloudServiceProvider.name.OPENSTACK, { name: 'Openstack', logo: OpenStackLogo }],
    [CloudServiceProvider.name.FLEXIBLE_ENGINE, { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    [CloudServiceProvider.name.AWS, { name: 'aws', logo: AWSLogo }],
    [CloudServiceProvider.name.GOOGLE, { name: 'Google', logo: GoogleLogo }],
    [CloudServiceProvider.name.SCS, { name: 'SCS', logo: ScsLogo }],
]);
