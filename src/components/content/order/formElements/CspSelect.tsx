/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { csp, name } from '../../../../xpanse-api/generated';
import { cspMap } from '../../common/csp/CspLogo';

export default function CspSelect({
    selectCsp,
    cspList,
    onChangeHandler,
}: {
    selectCsp: csp;
    cspList: csp[];
    onChangeHandler: (csp: csp) => void;
}): React.JSX.Element {
    return (
        <>
            <div className={serviceOrderStyles.orderFormFlexElements}>
                <div
                    className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                >
                    Cloud Service Provider:
                </div>
                <div className={serviceOrderStyles.servicesContentBody}>
                    {cspList.map((item, index) => {
                        return (
                            <div
                                onClick={() => {
                                    onChangeHandler(item);
                                }}
                                key={index}
                                className={
                                    selectCsp.valueOf() === item.valueOf()
                                        ? serviceOrderStyles.cloudProviderSelectHover
                                        : serviceOrderStyles.cloudProviderSelect
                                }
                            >
                                <Image
                                    width={200}
                                    height={56}
                                    src={cspMap.get(item as unknown as name)?.logo}
                                    alt={item}
                                    preview={false}
                                    fallback={'https://img.shields.io/badge/-' + item + '-gray'}
                                />
                                <div className={serviceOrderStyles.serviceTypeOptionInfo} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
