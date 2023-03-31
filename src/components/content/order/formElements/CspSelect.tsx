/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServiceProviderNameEnum } from '../../../../xpanse-api/generated';
import { AlibabaLogo, AWSLogo, AzureLogo, FlexibleEngineLogo, GoogleLogo, HuaWeiLogo, OpenStackLogo } from '../CspLogo';
import { Image } from 'antd';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

const cspMap = new Map<CloudServiceProviderNameEnum, CSP>([
    ['huawei', { name: 'Huawei', logo: HuaWeiLogo }],
    ['azure', { name: 'Azure', logo: AzureLogo }],
    ['alibaba', { name: 'Alibaba', logo: AlibabaLogo }],
    ['openstack', { name: 'Openstack', logo: OpenStackLogo }],
    ['google', { name: 'Google', logo: GoogleLogo }],
    ['flexibleEngine', { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    ['aws', { name: 'aws', logo: AWSLogo }],
]);

export default function CspSelect({
    selectCsp,
    cspList,
    onChangeHandler,
}: {
    selectCsp: string;
    cspList: CloudServiceProviderNameEnum[];
    onChangeHandler: (csp: string) => void;
}): JSX.Element {
    return (
        <>
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            <div className={'services-content-body'}>
                {cspList.map((item, index) => {
                    return (
                        <div
                            onClick={() => {
                                onChangeHandler(item);
                            }}
                            key={index}
                            className={selectCsp === item ? 'cloud-provider-select-hover' : 'cloud-provider-select'}
                        >
                            <Image
                                width={200}
                                height={56}
                                src={cspMap.get(item)?.logo}
                                alt={item}
                                preview={false}
                                fallback={'https://img.shields.io/badge/-' + item + '-gray'}
                            />
                            <div className='service-type-option-info' />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
