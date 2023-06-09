/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image, Select, Space, Tabs } from 'antd';
import { Billing, CloudServiceProvider, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import React from 'react';
import { cspMap } from '../formElements/CspSelect';
import { getBilling, getFlavorList } from '../formElements/CommonTypes';
import { currencyMapper } from '../../../utils/currency';

export const DestroyService = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    selectCsp: CloudServiceProvider.name | undefined;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
}): JSX.Element => {
    const areaList: Tab[] = [{ key: selectArea, label: selectArea, disabled: true }];

    const currentFlavorList: { value: string; label: string; price: string }[] =
        getFlavorList(userAvailableServiceVoList);
    const currentBilling: Billing = getBilling(
        userAvailableServiceVoList,
        selectCsp === undefined ? CloudServiceProvider.name.OPENSTACK : selectCsp
    );

    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });

    const currency: string = currencyMapper[currentBilling.currency];
    return (
        <>
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            <div className={'services-content-body'}>
                <div className={'cloud-provider-select-hover'}>
                    <Image
                        width={200}
                        height={56}
                        src={
                            cspMap.get(selectCsp === undefined ? CloudServiceProvider.name.OPENSTACK : selectCsp)?.logo
                        }
                        alt={selectCsp}
                        preview={false}
                        fallback={
                            'https://img.shields.io/badge/-' +
                            (selectCsp === undefined ? '' : selectCsp.toString()) +
                            '-gray'
                        }
                    />
                    <div className='service-type-option-info' />
                </div>
            </div>
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs type='card' size='middle' activeKey={selectArea} tabPosition={'top'} items={areaList} />
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        defaultValue={selectRegion}
                        value={selectRegion}
                        style={{ width: 450 }}
                        disabled={true}
                    />
                </Space>
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        value={selectFlavor}
                        style={{ width: 450 }}
                        disabled={true}
                    />
                </Space>
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                Price:&nbsp;
                <span className={'services-content-price-class'}>
                    {priceValue}&nbsp;{currency}
                </span>
            </div>
        </>
    );
};
