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
import RegioCloudLogo from '../../../../img/Regio_Cloud_Logo.png';
import PlusServerLogo from '../../../../img/Scs_PlusServer_Logo.png';
import { name } from '../../../../xpanse-api/generated';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

export const cspMap = new Map<string, CSP>([
    [name.HUAWEI_CLOUD, { name: 'HuaweiCloud', logo: HuaWeiLogo }],
    [name.AZURE, { name: 'Azure', logo: AzureLogo }],
    [name.ALIBABA_CLOUD, { name: 'AlibabaCloud', logo: AlibabaLogo }],
    [name.OPENSTACK_TESTLAB, { name: 'OpenstackTestlab', logo: OpenStackLogo }],
    [name.FLEXIBLE_ENGINE, { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    [name.AWS, { name: 'aws', logo: AWSLogo }],
    [name.GOOGLE_CLOUD_PLATFORM, { name: 'GoogleCloudPlatform', logo: GoogleLogo }],
    [name.PLUS_SERVER, { name: 'PlusServer', logo: PlusServerLogo }],
    [name.REGIO_CLOUD, { name: 'RegioCloud', logo: RegioCloudLogo }],
]);
