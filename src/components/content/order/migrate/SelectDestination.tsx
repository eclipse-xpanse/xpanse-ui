/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import CspSelect from '../formElements/CspSelect';
import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Button, Form, Space, StepProps, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useMemo, useState } from 'react';
import { Region } from '../types/Region';
import { Flavor } from '../types/Flavor';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { convertAreasToTabs, getAreaForRegion } from '../formDataHelpers/areaHelper';
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
    currentRegion,
    currentFlavor,
    currentServiceHostingType,
    setCurrentMigrationStep,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    updateSelectedParameters: (
        selectedCsp: UserOrderableServiceVo.csp,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
    ) => void;
    currentCsp: UserOrderableServiceVo.csp;
    currentRegion: string;
    currentFlavor: string;
    currentServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const cspList = useMemo(() => {
        const currentCspList: UserOrderableServiceVo.csp[] = [];
        userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
            if (!currentCspList.includes(userOrderableServiceVo.csp)) {
                currentCspList.push(userOrderableServiceVo.csp);
            }
        });
        return currentCspList;
    }, [userOrderableServiceVoList]);
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp>(currentCsp);
    let serviceHostTypes = getAvailableServiceHostingTypes(selectCsp, userOrderableServiceVoList);
    const [selectServiceHostType, setSelectServiceHostType] =
        useState<UserOrderableServiceVo.serviceHostingType>(currentServiceHostingType);

    let areaList: Tab[] = convertAreasToTabs(selectCsp, selectServiceHostType, userOrderableServiceVoList);
    const [selectArea, setSelectArea] = useState<string>(
        getAreaForRegion(selectCsp, selectServiceHostType, userOrderableServiceVoList, currentRegion)
    );

    let regionList: Region[] = getRegionDropDownValues(
        selectCsp,
        selectServiceHostType,
        selectArea,
        userOrderableServiceVoList
    );
    const [selectRegion, setSelectRegion] = useState<string>(currentRegion);

    let flavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostType, userOrderableServiceVoList);
    const [selectFlavor, setSelectFlavor] = useState<string>(currentFlavor);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    let priceValue: string = flavorList.find((flavor) => flavor.value === selectFlavor)?.price ?? '';
    let currentBilling: Billing = getBilling(selectCsp, selectServiceHostType, userOrderableServiceVoList);

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
    };

    const next = () => {
        setIsPreviousDisabled(true);
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.PrepareDeploymentParameters);
    };

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        setSelectServiceHostType(serviceHostingType);
        updateSelectedParameters(selectCsp, selectArea, selectRegion, selectFlavor, serviceHostingType);
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        currentBilling = getBilling(selectCsp, selectServiceHostType, userOrderableServiceVoList);
        flavorList.forEach((flavor) => {
            if (newFlavor === flavor.value) {
                priceValue = flavor.price;
            }
        });
        updateSelectedParameters(selectCsp, selectArea, selectRegion, newFlavor, selectServiceHostType);
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
        updateSelectedParameters(selectCsp, selectArea, value, selectFlavor, selectServiceHostType);
    };

    const onChangeAreaValue = (newArea: string) => {
        setSelectArea(newArea);
        const currentRegionList = getRegionDropDownValues(
            selectCsp,
            selectServiceHostType,
            newArea,
            userOrderableServiceVoList
        );
        regionList = currentRegionList;
        setSelectRegion(currentRegionList[0]?.value ?? '');
        updateSelectedParameters(
            selectCsp,
            newArea,
            currentRegionList[0]?.value ?? '',
            selectFlavor,
            selectServiceHostType
        );
    };

    const onChangeCloudProvider = (csp: UserOrderableServiceVo.csp) => {
        serviceHostTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        areaList = convertAreasToTabs(csp, serviceHostTypes[0], userOrderableServiceVoList);
        regionList = getRegionDropDownValues(
            csp,
            serviceHostTypes[0],
            areaList[0]?.key ?? '',
            userOrderableServiceVoList
        );
        flavorList = getFlavorList(csp, serviceHostTypes[0], userOrderableServiceVoList);
        currentBilling = getBilling(csp, serviceHostTypes[0], userOrderableServiceVoList);
        priceValue = flavorList[0].value;
        serviceHostTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        setSelectCsp(csp);
        setSelectArea(areaList[0]?.key ?? '');
        setSelectRegion(regionList[0]?.value ?? '');
        setSelectFlavor(flavorList[0]?.value ?? '');
        setSelectServiceHostType(serviceHostTypes[0]);
        updateSelectedParameters(
            csp,
            areaList[0]?.key ?? '',
            regionList[0]?.value ?? '',
            flavorList[0]?.value ?? '',
            serviceHostTypes[0]
        );
    };

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
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                next();
                            }}
                        >
                            Next
                        </Button>
                    </Space>
                </div>
            </div>
        </Form>
    );
};
