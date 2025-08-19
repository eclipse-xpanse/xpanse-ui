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
import { Csp } from '../../../../xpanse-api/generated';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

export const cspMap = new Map<Csp, CSP>([
    [Csp.HUAWEI_CLOUD, { name: 'HuaweiCloud', logo: HuaWeiLogo }],
    [Csp.AZURE, { name: 'Azure', logo: AzureLogo }],
    [Csp.ALIBABA_CLOUD, { name: 'AlibabaCloud', logo: AlibabaLogo }],
    [Csp.OPENSTACK_TESTLAB, { name: 'OpenstackTestlab', logo: OpenStackLogo }],
    [Csp.FLEXIBLE_ENGINE, { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    [Csp.AWS, { name: 'aws', logo: AWSLogo }],
    [Csp.GOOGLE_CLOUD_PLATFORM, { name: 'GoogleCloudPlatform', logo: GoogleLogo }],
    [Csp.PLUS_SERVER, { name: 'PlusServer', logo: PlusServerLogo }],
    [Csp.REGIO_CLOUD, { name: 'RegioCloud', logo: RegioCloudLogo }],
]);
