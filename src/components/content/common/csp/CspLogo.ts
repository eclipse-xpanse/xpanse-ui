/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import AlibabaLogo from '../../../../img/Alibaba_Logo.png';
import AWSLogo from '../../../../img/Aws_Logo.png';
import FlexibleEngineLogo from '../../../../img/FlexibleEngine_Logo.png';
import GoogleLogo from '../../../../img/Google_Logo.png';
import HuaWeiLogo from '../../../../img/Huawei_Logo.png';
import AzureLogo from '../../../../img/Microsoft_Azure_Logo.png';
import OpenStackLogo from '../../../../img/OpenStack_Logo.png';
import ScsLogo from '../../../../img/Regio_Cloud_Logo.png';
import { CloudServiceProvider } from '../../../../xpanse-api/generated';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

export const cspMap = new Map<CloudServiceProvider['name'], CSP>([
    ['huawei', { name: 'Huawei', logo: HuaWeiLogo }],
    ['azure', { name: 'Azure', logo: AzureLogo }],
    ['alicloud', { name: 'Alibaba', logo: AlibabaLogo }],
    ['openstack', { name: 'Openstack', logo: OpenStackLogo }],
    ['flexibleEngine', { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    ['aws', { name: 'aws', logo: AWSLogo }],
    ['google', { name: 'Google', logo: GoogleLogo }],
    ['scs', { name: 'SCS', logo: ScsLogo }],
]);
