/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseQueryResult } from '@tanstack/react-query';
import { Button, Form, Space, StepProps, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    AvailabilityZoneConfig,
    billingMode,
    csp,
    Region,
    ServiceFlavor,
    serviceHostingType,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { AvailabilityZoneFormItem } from '../common/availabilityzone/AvailabilityZoneFormItem.tsx';
import { BillingModeSelection } from '../common/BillingModeSelection';
import { FlavorSelection } from '../common/FlavorSelection.tsx';
import { RegionSelection } from '../common/RegionSelection.tsx';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import useGetAvailabilityZonesForRegionQuery from '../common/utils/useGetAvailabilityZonesForRegionQuery';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getBillingModes, getDefaultBillingMode } from '../formDataHelpers/billingHelper';
import { getServiceFlavorList } from '../formDataHelpers/flavorHelper';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import CspSelect from '../formElements/CspSelect';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';

export const SelectDestination = ({
    userOrderableServiceVoList,
    updateSelectedParameters,
    cspList,
    selectCsp,
    setSelectCsp,
    serviceHostTypes,
    selectServiceHostType,
    setSelectServiceHostingType,
    areaList,
    selectArea,
    setSelectArea,
    regionList,
    selectRegion,
    setSelectRegion,
    selectAvailabilityZones,
    setSelectAvailabilityZones,
    currentFlavor,
    billingModes,
    selectBillingMode,
    setSelectBillingMode,
    setCurrentPortingStep,
    stepItem,
    onChangeFlavor,
    getServicePriceQuery,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    updateSelectedParameters: (
        selectedCsp: csp,
        selectedArea: string,
        selectedRegion: Region,
        selectAvailabilityZones: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: serviceHostingType
    ) => void;
    cspList: csp[];
    selectCsp: csp;
    setSelectCsp: Dispatch<SetStateAction<csp>>;
    serviceHostTypes: serviceHostingType[];
    selectServiceHostType: serviceHostingType;
    setSelectServiceHostingType: Dispatch<SetStateAction<serviceHostingType>>;
    areaList: Tab[];
    selectArea: string;
    setSelectArea: Dispatch<SetStateAction<string>>;
    regionList: RegionDropDownInfo[];
    selectRegion: Region;
    setSelectRegion: Dispatch<SetStateAction<Region>>;
    selectAvailabilityZones: Record<string, string>;
    setSelectAvailabilityZones: Dispatch<SetStateAction<Record<string, string>>>;
    currentFlavor: string;
    billingModes: billingMode[] | undefined;
    selectBillingMode: billingMode;
    setSelectBillingMode: Dispatch<SetStateAction<billingMode>>;
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    stepItem: StepProps;
    onChangeFlavor: (newFlavor: string) => void;
    getServicePriceQuery: UseQueryResult<ServiceFlavorWithPriceResult[]>;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const getServiceTemplateId = (): string => {
        const service = userOrderableServiceVoList.find(
            (service) => service.csp === selectCsp && selectServiceHostType === service.serviceHostingType
        );
        return service ? service.serviceTemplateId : '';
    };
    const getAvailabilityZonesForRegionQuery = useGetAvailabilityZonesForRegionQuery(
        selectCsp,
        selectRegion,
        getServiceTemplateId()
    );
    const availabilityZoneConfigs: AvailabilityZoneConfig[] = getAvailabilityZoneRequirementsForAService(
        selectCsp,
        userOrderableServiceVoList
    );
    // Side effect needed to update initial state when data from backend is available.
    useEffect(() => {
        if (getAvailabilityZonesForRegionQuery.isSuccess && getAvailabilityZonesForRegionQuery.data.length > 0) {
            if (availabilityZoneConfigs.length > 0) {
                const defaultSelection: Record<string, string> = {};
                availabilityZoneConfigs.forEach((availabilityZoneConfig) => {
                    if (availabilityZoneConfig.mandatory) {
                        defaultSelection[availabilityZoneConfig.varName] = getAvailabilityZonesForRegionQuery.data[0];
                    }
                });
                setSelectAvailabilityZones(defaultSelection);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAvailabilityZonesForRegionQuery.isSuccess, getAvailabilityZonesForRegionQuery.data]);

    let flavorList: ServiceFlavor[] = getServiceFlavorList(
        selectCsp,
        selectServiceHostType,
        userOrderableServiceVoList
    );
    const [selectFlavor, setSelectFlavor] = useState<string>(currentFlavor);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentPortingStep(ServicePortingSteps.SelectPortingTarget);
    };

    const next = () => {
        setIsPreviousDisabled(true);
        stepItem.status = 'finish';
        setCurrentPortingStep(ServicePortingSteps.PrepareDeploymentParameters);
    };

    const onChangeServiceHostingType = (serviceHostingType: serviceHostingType) => {
        setSelectServiceHostingType(selectServiceHostType);
        billingModes = getBillingModes(selectCsp, selectServiceHostType, userOrderableServiceVoList);

        const defaultBillingMode: billingMode | undefined = getDefaultBillingMode(
            selectCsp,
            selectServiceHostType,
            userOrderableServiceVoList
        );
        setSelectBillingMode(
            defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : billingMode.FIXED
        );
        updateSelectedParameters(
            selectCsp,
            selectArea,
            selectRegion,
            selectAvailabilityZones,
            selectFlavor,
            serviceHostingType
        );
    };

    const onChangeRegion = (value: Region) => {
        setSelectRegion(value);
        updateSelectedParameters(
            selectCsp,
            selectArea,
            value,
            selectAvailabilityZones,
            selectFlavor,
            selectServiceHostType
        );
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
        setSelectRegion(currentRegionList[0].region);
        updateSelectedParameters(
            selectCsp,
            newArea,
            currentRegionList[0].region,
            selectAvailabilityZones,
            selectFlavor,
            selectServiceHostType
        );
    };

    const onChangeCloudProvider = (csp: csp) => {
        serviceHostTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        areaList = convertAreasToTabs(csp, serviceHostTypes[0], userOrderableServiceVoList);
        regionList = getRegionDropDownValues(
            csp,
            serviceHostTypes[0],
            areaList[0]?.key ?? '',
            userOrderableServiceVoList
        );
        flavorList = getServiceFlavorList(csp, serviceHostTypes[0], userOrderableServiceVoList);
        billingModes = getBillingModes(csp, serviceHostTypes[0], userOrderableServiceVoList);
        serviceHostTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        setSelectCsp(csp);
        setSelectArea(areaList[0]?.key ?? '');
        setSelectRegion(regionList[0].region);
        setSelectFlavor(flavorList[0]?.name ?? '');
        setSelectServiceHostingType(serviceHostTypes[0]);
        const defaultBillingMode: billingMode | undefined = getDefaultBillingMode(
            selectCsp,
            selectServiceHostType,
            userOrderableServiceVoList
        );
        setSelectBillingMode(
            defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : billingMode.FIXED
        );
        updateSelectedParameters(
            csp,
            areaList[0]?.key ?? '',
            regionList[0].region,
            selectAvailabilityZones,
            flavorList[0]?.name ?? '',
            serviceHostTypes[0]
        );
    };

    function onAvailabilityZoneChange(varName: string, availabilityZone: string | undefined) {
        if (availabilityZone !== undefined) {
            setSelectAvailabilityZones((prevState: Record<string, string>) => ({
                ...prevState,
                [varName]: availabilityZone,
            }));
        } else {
            const newAvailabilityZone = selectAvailabilityZones;
            delete newAvailabilityZone[varName];
            setSelectAvailabilityZones({ ...newAvailabilityZone });
        }
    }

    function isAvailabilityZoneRequired(): boolean {
        return availabilityZoneConfigs.filter((availabilityZoneConfig) => availabilityZoneConfig.mandatory).length > 0;
    }

    return (
        <Form
            form={form}
            layout='inline'
            autoComplete='off'
            initialValues={{ selectRegion, selectFlavor }}
            onFinish={next}
            validateTrigger={['next']}
            className={serviceOrderStyles.orderFormInlineDisplay}
        >
            <div className={tableStyles.genericTableContainer}>
                <div className={serviceOrderStyles.orderFormGroupItems}>
                    <CspSelect
                        selectCsp={selectCsp}
                        cspList={cspList}
                        onChangeHandler={(csp) => {
                            onChangeCloudProvider(csp);
                        }}
                    />
                    <ServiceHostingSelection
                        serviceHostingTypes={serviceHostTypes}
                        updateServiceHostingType={onChangeServiceHostingType}
                        disabledAlways={false}
                        previousSelection={selectServiceHostType}
                    ></ServiceHostingSelection>
                </div>
                <div className={serviceOrderStyles.orderFormGroupItems}>
                    <div
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${appStyles.contentTitle} ${serviceOrderStyles.orderFormSelectionFirstInGroup}`}
                    >
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
                    <RegionSelection
                        selectArea={selectArea}
                        selectRegion={selectRegion}
                        onChangeRegion={onChangeRegion}
                        regionList={regionList}
                    />
                    {availabilityZoneConfigs.map((availabilityZoneConfig) => {
                        return (
                            <AvailabilityZoneFormItem
                                availabilityZoneConfig={availabilityZoneConfig}
                                selectRegion={selectRegion}
                                onAvailabilityZoneChange={onAvailabilityZoneChange}
                                selectAvailabilityZones={selectAvailabilityZones}
                                selectCsp={selectCsp}
                                key={availabilityZoneConfig.varName}
                                selectedServiceTemplateId={getServiceTemplateId()}
                            />
                        );
                    })}
                </div>
                <div className={serviceOrderStyles.orderFormGroupItems}>
                    <BillingModeSelection
                        selectBillingMode={selectBillingMode}
                        setSelectBillingMode={setSelectBillingMode}
                        billingModes={billingModes}
                    />
                    <FlavorSelection
                        selectFlavor={selectFlavor}
                        setSelectFlavor={setSelectFlavor}
                        flavorList={flavorList}
                        onChangeFlavor={onChangeFlavor}
                        getServicePriceQuery={getServicePriceQuery}
                    />
                </div>
            </div>
            <div className={serviceOrderStyles.portingStepButtonInnerClass}>
                <Space size={'large'}>
                    <Button
                        type='primary'
                        onClick={() => {
                            prev();
                        }}
                        disabled={isPreviousDisabled}
                    >
                        Previous
                    </Button>
                    <Button
                        type='primary'
                        disabled={
                            getAvailabilityZonesForRegionQuery.isPending ||
                            getServicePriceQuery.isPending ||
                            getServicePriceQuery.isError ||
                            (isAvailabilityZoneRequired() && getAvailabilityZonesForRegionQuery.isError)
                        }
                        htmlType='submit'
                    >
                        Next
                    </Button>
                </Space>
            </div>
        </Form>
    );
};
