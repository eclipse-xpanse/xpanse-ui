/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image } from 'antd';
import { CloudServiceProvider, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import React from 'react';
import { cspMap } from '../types/CspLogo';

export default function CspSelect({
    selectCsp,
    cspList,
    onChangeHandler,
}: {
    selectCsp: UserOrderableServiceVo.csp;
    cspList: UserOrderableServiceVo.csp[];
    onChangeHandler: (csp: UserOrderableServiceVo.csp) => void;
}): React.JSX.Element {
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
                                src={cspMap.get(item as unknown as CloudServiceProvider.name)?.logo}
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
