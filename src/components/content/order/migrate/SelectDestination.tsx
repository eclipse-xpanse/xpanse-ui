/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import CspSelect from '../formElements/CspSelect';
import { Billing, CloudServiceProvider, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { Select, Space, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import { currencyMapper } from '../../../utils/currency';
import { Area } from '../../../utils/Area';
import { filterAreaList, getBilling, getFlavorList, getRegionList } from '../formElements/CommonTypes';

export const SelectDestination = ({
    userAvailableServiceVoList,
    getSelectedParameters,
    currentCsp,
    currentArea,
    currentRegion,
    currentFlavor,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    getSelectedParameters: (
        selectedCsp: CloudServiceProvider.name,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string
    ) => void;
    currentCsp: CloudServiceProvider.name | undefined;
    currentArea: string;
    currentRegion: string;
    currentFlavor: string;
}): JSX.Element => {
    const [selectCsp, setSelectCsp] = useState<CloudServiceProvider.name>(CloudServiceProvider.name.OPENSTACK);
    const [cspList, setCspList] = useState<CloudServiceProvider.name[]>([CloudServiceProvider.name.OPENSTACK]);

    const [areaList, setAreaList] = useState<Tab[]>([{ key: '', label: '' }]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<{ value: string; label: string; price: string }[]>([
        { value: '', label: '', price: '' },
    ]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [priceValue, setPriceValue] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');

    useEffect(() => {
        if (userAvailableServiceVoList.length > 0) {
            const currentCspList: CloudServiceProvider.name[] = [];
            userAvailableServiceVoList.forEach((v) => {
                currentCspList.push(v.csp as unknown as CloudServiceProvider.name);
            });
            setCspList(currentCspList);
            const currentFlavorList = getFlavorList(userAvailableServiceVoList);
            setFlavorList(currentFlavorList);

            let currentAreaList: Tab[] = getAreaList(userAvailableServiceVoList, currentCspList[0]);
            let currentRegionList: { value: string; label: string }[] = getRegionList(
                userAvailableServiceVoList,
                currentCspList[0],
                currentAreaList[0]?.key ?? ''
            );

            let currentBilling = getBilling(userAvailableServiceVoList, currentCspList[0]);
            let cspValue: CloudServiceProvider.name = currentCspList[0];
            let areaValue: string = currentAreaList[0]?.key ?? '';
            let regionValue: string = currentRegionList[0]?.value ?? '';
            let flavorValue: string = currentFlavorList[0]?.value ?? '';
            let priceValue: string = currentFlavorList[0]?.price ?? '';

            if (currentCsp !== undefined && currentCsp.length > 0) {
                currentAreaList = getAreaList(userAvailableServiceVoList, currentCsp);
                currentRegionList = getRegionList(userAvailableServiceVoList, currentCsp, currentArea);
                currentBilling = getBilling(userAvailableServiceVoList, currentCsp);
                cspValue = currentCsp;
                areaValue = currentArea;
                regionValue = currentRegion;
                flavorValue = currentFlavor;
                currentFlavorList.forEach((flavorItem) => {
                    if (flavorItem.value === currentFlavor) {
                        priceValue = flavorItem.price;
                    }
                });
            }
            const currencyValue: string = currencyMapper[currentBilling.currency];
            setSelectCsp(cspValue);
            setAreaList(currentAreaList);
            setSelectArea(areaValue);
            setRegionList(currentRegionList);
            setSelectRegion(regionValue);
            setSelectFlavor(flavorValue);
            setPriceValue(priceValue);
            setCurrency(currencyValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAvailableServiceVoList, currentCsp, currentArea, currentRegion, currentFlavor]);

    useEffect(() => {
        if (selectCsp.length > 0 && selectArea.length > 0 && selectRegion.length > 0 && selectFlavor.length > 0) {
            getSelectedParameters(selectCsp, selectArea, selectRegion, selectFlavor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectCsp, selectArea, selectRegion, selectFlavor]);

    function getAreaList(rsp: UserAvailableServiceVo[], selectCsp: string): Tab[] {
        const areas: Area[] = filterAreaList(rsp, selectCsp);
        let areaItems: Tab[] = [];
        if (areas.length > 0) {
            areaItems = areas.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: [],
                };
            });
        }
        return areaItems;
    }

    const onChangeCloudProvider = (csp: CloudServiceProvider.name) => {
        setSelectCsp(csp);
    };

    const onChangeAreaValue = (csp: CloudServiceProvider.name, key: string) => {
        const currentRegionList = getRegionList(userAvailableServiceVoList, csp, key);
        setSelectArea(key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeFlavor = (value: string, csp: CloudServiceProvider.name) => {
        setSelectFlavor(value);
        const currentFlavorList = getFlavorList(userAvailableServiceVoList);
        const billing: Billing = getBilling(userAvailableServiceVoList, csp);
        currentFlavorList.forEach((flavor) => {
            if (value === flavor.value) {
                setPriceValue(flavor.price);
            }
        });
        setCurrency(currencyMapper[billing.currency]);
    };

    return (
        <div>
            <CspSelect
                selectCsp={selectCsp}
                cspList={cspList}
                onChangeHandler={(csp) => {
                    onChangeCloudProvider(csp as CloudServiceProvider.name);
                }}
            />
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs
                    type='card'
                    size='middle'
                    activeKey={selectArea}
                    tabPosition={'top'}
                    items={areaList}
                    onChange={(area) => {
                        onChangeAreaValue(selectCsp, area);
                    }}
                />
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        defaultValue={selectRegion}
                        value={selectRegion}
                        style={{ width: 450 }}
                        onChange={onChangeRegion}
                        options={regionList}
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
                        onChange={(value) => {
                            onChangeFlavor(value, selectCsp);
                        }}
                        options={flavorList}
                    />
                </Space>
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                Price:&nbsp;
                <span className={'services-content-price-class'}>
                    {priceValue}&nbsp;{currency}
                </span>
            </div>
        </div>
    );
};
