/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServiceProvider } from '../../../../xpanse-api/generated';
import HuaWeiLogo from '../../../../img/Huawei_Logo.png';
import AlibabaLogo from '../../../../img/Alibaba_Logo.png';
import AzureLogo from '../../../../img/Microsoft_Azure_Logo.png';
import AWSLogo from '../../../../img/Aws_Logo.png';
import OpenStackLogo from '../../../../img/OpenStack_Logo.png';
import GoogleLogo from '../../../../img/Google_Logo.png';
import FlexibleEngineLogo from '../../../../img/FlexibleEngine_Logo.png';
import ScsLogo from '../../../../img/Scs_Logo.png';

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
