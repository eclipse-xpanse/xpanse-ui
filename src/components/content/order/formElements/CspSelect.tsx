/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AlibabaLogo, AWSLogo, AzureLogo, FlexibleEngineLogo, HuaWeiLogo, OpenStackLogo } from '../CspLogo';
import { Image } from 'antd';
import { CloudServiceProvider } from '../../../../xpanse-api/generated';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

const cspMap = new Map<CloudServiceProvider.name, CSP>([
    [CloudServiceProvider.name.HUAWEI, { name: 'Huawei', logo: HuaWeiLogo }],
    [CloudServiceProvider.name.AZURE, { name: 'Azure', logo: AzureLogo }],
    [CloudServiceProvider.name.ALICLOUD, { name: 'Alibaba', logo: AlibabaLogo }],
    [CloudServiceProvider.name.OPENSTACK, { name: 'Openstack', logo: OpenStackLogo }],
    [CloudServiceProvider.name.FLEXIBLE_ENGINE, { name: 'FlexibleEngine', logo: FlexibleEngineLogo }],
    [CloudServiceProvider.name.AWS, { name: 'aws', logo: AWSLogo }],
]);

export default function CspSelect({
    selectCsp,
    cspList,
    onChangeHandler,
}: {
    selectCsp: string;
    cspList: CloudServiceProvider.name[];
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
                            className={
                                selectCsp.valueOf() === item.valueOf()
                                    ? 'cloud-provider-select-hover'
                                    : 'cloud-provider-select'
                            }
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
