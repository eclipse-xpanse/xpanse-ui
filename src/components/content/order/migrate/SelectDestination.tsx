/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import CspSelect from '../formElements/CspSelect';
import {
    AvailabilityZoneConfig,
    Billing,
    DeployRequest,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Button, Form, Space, StepProps, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Flavor } from '../types/Flavor';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { getBillingModes, getDefaultBillingMode } from '../formDataHelpers/billingHelper';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { MigrationSteps } from '../types/MigrationSteps';
import '../../../../styles/service_order.css';
import { BillingInfo } from '../common/BillingInfo';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';
import useGetAvailabilityZonesForRegionQuery from '../common/utils/useGetAvailabilityZonesForRegionQuery';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import { AvailabilityZoneFormItem } from '../common/availabilityzone/AvailabilityZoneFormItem';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { BillingModeSelection } from '../common/BillingModeSelection';

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
    setCurrentMigrationStep,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    updateSelectedParameters: (
        selectedCsp: UserOrderableServiceVo.csp,
        selectedArea: string,
        selectedRegion: string,
        selectAvailabilityZones: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
    ) => void;
    cspList: UserOrderableServiceVo.csp[];
    selectCsp: UserOrderableServiceVo.csp;
    setSelectCsp: Dispatch<SetStateAction<UserOrderableServiceVo.csp>>;
    serviceHostTypes: UserOrderableServiceVo.serviceHostingType[];
    selectServiceHostType: UserOrderableServiceVo.serviceHostingType;
    setSelectServiceHostingType: Dispatch<SetStateAction<UserOrderableServiceVo.serviceHostingType>>;
    areaList: Tab[];
    selectArea: string;
    setSelectArea: Dispatch<SetStateAction<string>>;
    regionList: RegionDropDownInfo[];
    selectRegion: string;
    setSelectRegion: Dispatch<SetStateAction<string>>;
    selectAvailabilityZones: Record<string, string>;
    setSelectAvailabilityZones: Dispatch<SetStateAction<Record<string, string>>>;
    currentFlavor: string;
    billingModes: DeployRequest.billingMode[] | undefined;
    selectBillingMode: string;
    setSelectBillingMode: Dispatch<SetStateAction<string>>;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const getAvailabilityZonesForRegionQuery = useGetAvailabilityZonesForRegionQuery(selectCsp, selectRegion);
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

    let flavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostType, userOrderableServiceVoList);
    const [selectFlavor, setSelectFlavor] = useState<string>(currentFlavor);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    let priceValue: string = flavorList.find((flavor) => flavor.value === selectFlavor)?.price ?? '';

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentMigrationStep(MigrationSteps.SelectMigrateTarget);
    };

    const next = () => {
        setIsPreviousDisabled(true);
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.PrepareDeploymentParameters);
    };

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        setSelectServiceHostingType(selectServiceHostType);
        billingModes = getBillingModes(selectCsp, selectServiceHostType, userOrderableServiceVoList);

        const defaultBillingMode: Billing.defaultBillingMode | undefined = getDefaultBillingMode(
            selectCsp,
            selectServiceHostType,
            userOrderableServiceVoList
        );
        setSelectBillingMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : '');
        updateSelectedParameters(
            selectCsp,
            selectArea,
            selectRegion,
            selectAvailabilityZones,
            selectFlavor,
            serviceHostingType
        );
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        billingModes = getBillingModes(selectCsp, selectServiceHostType, userOrderableServiceVoList);
        const defaultBillingMode: Billing.defaultBillingMode | undefined = getDefaultBillingMode(
            selectCsp,
            selectServiceHostType,
            userOrderableServiceVoList
        );
        setSelectBillingMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : '');
        flavorList.forEach((flavor) => {
            if (newFlavor === flavor.value) {
                priceValue = flavor.price;
            }
        });
        updateSelectedParameters(
            selectCsp,
            selectArea,
            selectRegion,
            selectAvailabilityZones,
            newFlavor,
            selectServiceHostType
        );
    };

    const onChangeRegion = (value: string) => {
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
        setSelectRegion(currentRegionList[0]?.value ?? '');
        updateSelectedParameters(
            selectCsp,
            newArea,
            currentRegionList[0]?.value ?? '',
            selectAvailabilityZones,
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
        billingModes = getBillingModes(csp, serviceHostTypes[0], userOrderableServiceVoList);
        priceValue = flavorList[0].value;
        serviceHostTypes = getAvailableServiceHostingTypes(csp, userOrderableServiceVoList);
        setSelectCsp(csp);
        setSelectArea(areaList[0]?.key ?? '');
        setSelectRegion(regionList[0]?.value ?? '');
        setSelectFlavor(flavorList[0]?.value ?? '');
        setSelectServiceHostingType(serviceHostTypes[0]);
        const defaultBillingMode: Billing.defaultBillingMode | undefined = getDefaultBillingMode(
            selectCsp,
            selectServiceHostType,
            userOrderableServiceVoList
        );
        setSelectBillingMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : '');
        updateSelectedParameters(
            csp,
            areaList[0]?.key ?? '',
            regionList[0]?.value ?? '',
            selectAvailabilityZones,
            flavorList[0]?.value ?? '',
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

    return (
        <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            initialValues={{ selectRegion, selectFlavor }}
            onFinish={next}
            validateTrigger={['next']}
        >
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
                {availabilityZoneConfigs.map((availabilityZoneConfig) => {
                    return (
                        <AvailabilityZoneFormItem
                            availabilityZoneConfig={availabilityZoneConfig}
                            selectRegion={selectRegion}
                            onAvailabilityZoneChange={onAvailabilityZoneChange}
                            selectAvailabilityZones={selectAvailabilityZones}
                            selectCsp={selectCsp}
                            key={availabilityZoneConfig.varName}
                        />
                    );
                })}
                <FlavorInfo selectFlavor={selectFlavor} flavorList={flavorList} onChangeFlavor={onChangeFlavor} />
                <BillingModeSelection
                    selectBillingMode={selectBillingMode}
                    setSelectBillingMode={setSelectBillingMode}
                    billingModes={billingModes}
                />
                <BillingInfo priceValue={priceValue} />
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
                        <Button type='primary' className={'migrate-steps-operation-button-clas'} htmlType='submit'>
                            Next
                        </Button>
                    </Space>
                </div>
            </div>
        </Form>
    );
};
