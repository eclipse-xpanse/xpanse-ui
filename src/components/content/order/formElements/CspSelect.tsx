/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { CloudServiceProviderNameEnum, Ocl, RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { AlibabaLogo, AWSLogo, AzureLogo, HuaWeiLogo } from '../CspLogo';
import { Image } from 'antd';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

const cspMap: Map<CloudServiceProviderNameEnum, CSP> = new Map([
    ['huawei', { name: 'Huawei', logo: HuaWeiLogo }],
    ['azure', { name: 'Azure', logo: AzureLogo }],
    ['alibaba', { name: 'Alibaba', logo: AlibabaLogo }],
    ['openstack', { name: 'Openstack', logo: 'unknown' }],
    ['aws', { name: 'aws', logo: AWSLogo }],
]);

export default function CspSelect({
    versionMapper,
    selectVersion,
    onChangeHandler,
}: {
    versionMapper: Map<string, RegisterServiceEntity[]>;
    selectVersion: string;
    onChangeHandler: (csp: string) => void;
}): JSX.Element {
    const [csp, setCsp] = useState<CSP[]>([]);
    const [isSelected, setIsSelected] = useState<number>();

    const onChangeCloudProvider = (key: string, index: number) => {
        onChangeHandler(key.charAt(0).toLowerCase() + key.slice(1));
        setIsSelected(index);
    };

    useEffect(() => {
        let cspItems: CSP[] = [];
        let oclList: Ocl[] = [];

        versionMapper.forEach((v, k) => {
            if (k === selectVersion) {
                let ocls: Ocl[] = [];
                for (let registerServiceEntity of v) {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        ocls.push(registerServiceEntity.ocl);
                    }
                }
                oclList = ocls;
            }
        });

        if (oclList.length > 0) {
            oclList.forEach((item) => {
                if (item.serviceVersion === selectVersion) {
                    if (item && item.cloudServiceProvider) {
                        cspItems.push({
                            name: cspMap.get(item.cloudServiceProvider.name)?.name as string,
                            logo: cspMap.get(item.cloudServiceProvider.name)?.logo,
                        });
                    }
                }
            });
            setCsp(cspItems);
            onChangeHandler(oclList[0].cloudServiceProvider.name);
            setIsSelected(oclList.indexOf(oclList[0]));
        }
    }, [versionMapper, selectVersion, onChangeHandler]);

    return (
        <>
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            <div className={'services-content-body'}>
                {csp.map((item, index) => {
                    return (
                        <div
                            onClick={() => {
                                onChangeCloudProvider(item.name, index);
                            }}
                            key={index}
                            className={isSelected === index ? 'cloud-provider-select-hover' : 'cloud-provider-select'}
                        >
                            {/*<img src={item.logo} alt={item.name} />*/}
                            <Image
                                width={200}
                                height={56}
                                src={item.logo}
                                alt={item.name}
                                preview={false}
                                fallback={'https://img.shields.io/badge/-' + item.name + '-gray'}
                            />
                            <div className='service-type-option-info' />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
