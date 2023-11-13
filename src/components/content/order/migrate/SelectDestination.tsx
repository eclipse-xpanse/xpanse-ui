/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import CspSelect from '../formElements/CspSelect';
import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Button, Select, Space, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import { currencyMapper } from '../../../utils/currency';
import { Area } from '../types/Area';
import {
    filterAreaList,
    getBilling,
    getFlavorMapper,
    getFlavorListByCsp,
    getRegionList,
    MigrationSteps,
} from '../formElements/CommonTypes';

export const SelectDestination = ({
    userOrderableServiceVoList,
    getSelectedParameters,
    currentCsp,
    currentArea,
    currentRegion,
    currentFlavor,
    getCurrentMigrationStep,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    getSelectedParameters: (
        selectedCsp: string,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string
    ) => void;
    currentCsp: string;
    currentArea: string;
    currentRegion: string;
    currentFlavor: string;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
}): JSX.Element => {
    const [selectCsp, setSelectCsp] = useState<string>('');
    const [cspList, setCspList] = useState<UserOrderableServiceVo.csp[]>([]);

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

    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.SelectADestination);

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
    };

    const next = () => {
        setIsPreviousDisabled(true);
        setCurrentMigrationStep(MigrationSteps.DeployServiceOnTheNewDestination);
    };

    useEffect(() => {
        getCurrentMigrationStep(currentMigrationStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStep]);

    useEffect(() => {
        if (userOrderableServiceVoList.length > 0) {
            const currentCspList: UserOrderableServiceVo.csp[] = [];
            userOrderableServiceVoList.forEach((v) => {
                currentCspList.push(v.csp as unknown as UserOrderableServiceVo.csp);
            });
            let cspValue: string = currentCspList[0];

            let currentAreaList: Tab[] = getAreaList(userOrderableServiceVoList, cspValue);
            let areaValue: string = currentAreaList[0]?.key ?? '';

            let currentRegionList: { value: string; label: string }[] = getRegionList(
                userOrderableServiceVoList,
                cspValue,
                areaValue
            );
            let regionValue: string = currentRegionList[0]?.value ?? '';

            const currentFlavorMapper = getFlavorMapper(userOrderableServiceVoList);
            let currentFlavorList = getFlavorListByCsp(currentFlavorMapper, cspValue);
            let flavorValue: string = currentFlavorList[0]?.value ?? '';
            let priceValue: string = currentFlavorList[0]?.price ?? '';

            let currentBilling = getBilling(userOrderableServiceVoList, cspValue);

            if (currentCsp.length > 0) {
                currentAreaList = getAreaList(userOrderableServiceVoList, currentCsp);
                currentRegionList = getRegionList(userOrderableServiceVoList, currentCsp, currentArea);
                currentFlavorList = getFlavorListByCsp(currentFlavorMapper, currentCsp);
                currentBilling = getBilling(userOrderableServiceVoList, currentCsp);
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
            setCspList(currentCspList);
            setSelectCsp(cspValue);
            setAreaList(currentAreaList);
            setSelectArea(areaValue);
            setRegionList(currentRegionList);
            setSelectRegion(regionValue);
            setFlavorList(currentFlavorList);
            setSelectFlavor(flavorValue);
            setPriceValue(priceValue);
            setCurrency(currencyValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userOrderableServiceVoList, currentCsp, currentArea, currentRegion, currentFlavor]);

    useEffect(() => {
        if (selectCsp.length > 0 && selectArea.length > 0 && selectRegion.length > 0 && selectFlavor.length > 0) {
            getSelectedParameters(selectCsp, selectArea, selectRegion, selectFlavor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectCsp, selectArea, selectRegion, selectFlavor]);

    function getAreaList(rsp: UserOrderableServiceVo[], selectCsp: string): Tab[] {
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

    const onChangeCloudProvider = (csp: string) => {
        const currentAreaList = getAreaList(userOrderableServiceVoList, csp);
        const currentRegionList = getRegionList(userOrderableServiceVoList, csp, currentAreaList[0]?.key ?? '');
        const currentFlavorList = getFlavorListByCsp(getFlavorMapper(userOrderableServiceVoList), csp);
        const billing: Billing = getBilling(userOrderableServiceVoList, csp);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
    };

    const onChangeAreaValue = (area: string) => {
        const currentRegionList = getRegionList(userOrderableServiceVoList, selectCsp, area);
        setSelectArea(area);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeFlavor = (value: string) => {
        const currentFlavorList = getFlavorListByCsp(getFlavorMapper(userOrderableServiceVoList), selectCsp);
        const billing: Billing = getBilling(userOrderableServiceVoList, selectCsp);

        setSelectFlavor(value);
        setCurrency(currencyMapper[billing.currency]);
        currentFlavorList.forEach((flavor) => {
            if (value === flavor.value) {
                setPriceValue(flavor.price);
            }
        });
    };

    return (
        <div>
            <CspSelect
                selectCsp={selectCsp}
                cspList={cspList}
                onChangeHandler={(csp) => {
                    onChangeCloudProvider(csp);
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
                        onChangeAreaValue(area);
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
                            onChangeFlavor(value);
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
            <div className={'migrate-step-button-inner-class'}>
                <Space size={'large'}>
                    {currentMigrationStep > MigrationSteps.ExportServiceData ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                prev();
                            }}
                            disabled={isPreviousDisabled}
                        >
                            Previous
                        </Button>
                    ) : (
                        <></>
                    )}

                    {currentMigrationStep < MigrationSteps.DestroyTheOldService ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                next();
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <></>
                    )}
                </Space>
            </div>
        </div>
    );
};
