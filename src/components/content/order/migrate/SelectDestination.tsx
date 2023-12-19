/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import CspSelect from '../formElements/CspSelect';
import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Button, Form, Space, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import { Region } from '../types/Region';
import { Flavor } from '../types/Flavor';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { getBilling } from '../formDataHelpers/billingHelper';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { MigrationSteps } from '../types/MigrationSteps';
import '../../../../styles/service_order.css';
import { BillingInfo } from '../common/BillingInfo';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';

export const SelectDestination = ({
    userOrderableServiceVoList,
    updateSelectedParameters,
    currentCsp,
    currentArea,
    currentRegion,
    currentFlavor,
    currentServiceHostingType,
    getCurrentMigrationStep,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    updateSelectedParameters: (
        selectedCsp: UserOrderableServiceVo.csp,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
    ) => void;
    currentCsp: UserOrderableServiceVo.csp | undefined;
    currentArea: string;
    currentRegion: string;
    currentFlavor: string;
    currentServiceHostingType: UserOrderableServiceVo.serviceHostingType | undefined;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
}): React.JSX.Element => {
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp | undefined>(undefined);
    const [cspList, setCspList] = useState<UserOrderableServiceVo.csp[]>([]);

    const [areaList, setAreaList] = useState<Tab[]>([]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<Region[]>([]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<Flavor[]>([]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');

    const [priceValue, setPriceValue] = useState<string>('');
    const [currentBilling, setCurrentBilling] = useState<Billing | undefined>(undefined);

    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.SelectADestination);

    const [selectServiceHostType, setSelectServiceHostType] = useState<
        UserOrderableServiceVo.serviceHostingType | undefined
    >(undefined);
    const [serviceHostTypes, setServiceHostTypes] = useState<UserOrderableServiceVo.serviceHostingType[]>([]);

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
            userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
                if (!currentCspList.includes(userOrderableServiceVo.csp)) {
                    currentCspList.push(userOrderableServiceVo.csp);
                }
            });

            let cspValue: UserOrderableServiceVo.csp = currentCspList[0];

            let serviceHostingTypes = getAvailableServiceHostingTypes(currentCspList[0], userOrderableServiceVoList);
            let serviceHostingTypeValue = serviceHostingTypes[0];

            let currentAreaList: Tab[] = convertAreasToTabs(
                cspValue,
                serviceHostingTypes[0],
                userOrderableServiceVoList
            );
            let areaValue: string = currentAreaList[0]?.key ?? '';

            let currentRegionList: Region[] = getRegionDropDownValues(
                cspValue,
                serviceHostingTypes[0],
                areaValue,
                userOrderableServiceVoList
            );
            let regionValue: string = currentRegionList[0]?.value ?? '';

            let currentFlavorList = getFlavorList(cspValue, serviceHostingTypes[0], userOrderableServiceVoList);
            let flavorValue: string = currentFlavorList[0]?.value ?? '';
            let priceValue: string = currentFlavorList[0]?.price ?? '';

            let currentBilling = getBilling(currentCspList[0], serviceHostingTypes[0], userOrderableServiceVoList);

            if (currentCsp && currentServiceHostingType) {
                serviceHostingTypes = getAvailableServiceHostingTypes(currentCsp, userOrderableServiceVoList);
                currentAreaList = convertAreasToTabs(currentCsp, currentServiceHostingType, userOrderableServiceVoList);
                currentRegionList = getRegionDropDownValues(
                    currentCsp,
                    currentServiceHostingType,
                    currentAreaList[0]?.key ?? '',
                    userOrderableServiceVoList
                );
                currentFlavorList = getFlavorList(currentCsp, currentServiceHostingType, userOrderableServiceVoList);
                currentBilling = getBilling(currentCsp, currentServiceHostingType, userOrderableServiceVoList);
                areaValue = currentArea;
                cspValue = currentCsp;
                regionValue = currentRegion;
                flavorValue = currentFlavor;
                serviceHostingTypeValue = currentServiceHostingType;
                currentFlavorList.forEach((flavorItem) => {
                    if (flavorItem.value === currentFlavor) {
                        priceValue = flavorItem.price;
                    }
                });
            }
            setCspList(currentCspList);
            setSelectCsp(cspValue);
            setAreaList(currentAreaList);
            setSelectArea(areaValue);
            setRegionList(currentRegionList);
            setSelectRegion(regionValue);
            setFlavorList(currentFlavorList);
            setSelectFlavor(flavorValue);
            setPriceValue(priceValue);
            setCurrentBilling(currentBilling);
            setServiceHostTypes(serviceHostingTypes);
            setSelectServiceHostType(serviceHostingTypeValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            selectCsp &&
            selectArea.length > 0 &&
            selectRegion.length > 0 &&
            selectFlavor.length > 0 &&
            selectServiceHostType
        ) {
            updateSelectedParameters(selectCsp, selectArea, selectRegion, selectFlavor, selectServiceHostType);
        }
    }, [selectCsp, selectArea, selectRegion, selectFlavor, selectServiceHostType, updateSelectedParameters]);

    const onChangeCloudProvider = (csp: UserOrderableServiceVo.csp) => {
        const serviceHostingTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        const currentAreaList = convertAreasToTabs(csp, serviceHostingTypes[0], userOrderableServiceVoList);
        const currentRegionList = getRegionDropDownValues(
            csp,
            serviceHostingTypes[0],
            currentAreaList[0]?.key ?? '',
            userOrderableServiceVoList
        );
        const currentFlavorList = getFlavorList(csp, serviceHostingTypes[0], userOrderableServiceVoList);
        const billing: Billing = getBilling(csp, serviceHostingTypes[0], userOrderableServiceVoList);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrentBilling(billing);
    };

    const onChangeAreaValue = (area: string) => {
        if (selectCsp) {
            const currentRegionList = getRegionDropDownValues(
                selectCsp,
                selectServiceHostType ?? serviceHostTypes[0],
                area,
                userOrderableServiceVoList
            );
            setSelectArea(area);
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
        }
    };

    const onChangeRegion = (newRegion: string) => {
        setSelectRegion(newRegion);
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        if (selectCsp) {
            const billing: Billing = getBilling(
                selectCsp,
                selectServiceHostType ?? serviceHostTypes[0],
                userOrderableServiceVoList
            );
            setSelectFlavor(newFlavor);
            setCurrentBilling(billing);
            flavorList.forEach((flavor) => {
                if (newFlavor === flavor.value) {
                    setPriceValue(flavor.price);
                }
            });
        }
    };

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        setSelectServiceHostType(serviceHostingType);
        if (selectCsp) {
            const currentAreaList = convertAreasToTabs(selectCsp, serviceHostingType, userOrderableServiceVoList);
            const currentRegionList = getRegionDropDownValues(
                selectCsp,
                serviceHostingType,
                currentAreaList[0]?.key ?? '',
                userOrderableServiceVoList
            );
            const currentFlavorList = getFlavorList(selectCsp, serviceHostingType, userOrderableServiceVoList);
            const currentBilling = getBilling(selectCsp, serviceHostingType, userOrderableServiceVoList);
            setAreaList(currentAreaList);
            setSelectArea(currentAreaList[0]?.key ?? '');
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
            setFlavorList(currentFlavorList);
            setSelectFlavor(currentFlavorList[0]?.value ?? '');
            setPriceValue(currentFlavorList[0].price);
            setCurrentBilling(currentBilling);
        }
    };

    if (selectCsp) {
        return (
            <Form layout='vertical' initialValues={{ selectRegion, selectFlavor }}>
                <div>
                    <CspSelect
                        selectCsp={selectCsp}
                        cspList={cspList}
                        onChangeHandler={(csp) => {
                            onChangeCloudProvider(csp);
                        }}
                    />
                    <br />
                    <ServiceHostingSelection
                        serviceHostingTypes={serviceHostTypes}
                        updateServiceHostingType={onChangeServiceHostingType}
                        disabledAlways={false}
                        previousSelection={selectServiceHostType}
                    ></ServiceHostingSelection>
                    <br />
                    <br />
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
                    <RegionInfo selectRegion={selectRegion} onChangeRegion={onChangeRegion} regionList={regionList} />
                    <FlavorInfo selectFlavor={selectFlavor} flavorList={flavorList} onChangeFlavor={onChangeFlavor} />
                    <BillingInfo priceValue={priceValue} billing={currentBilling} />
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
            </Form>
        );
    }
    return <></>;
};
