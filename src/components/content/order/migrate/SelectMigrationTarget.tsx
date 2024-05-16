/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Form, Radio, RadioChangeEvent, Space, StepProps } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { MigrationSteps } from '../types/MigrationSteps';
import {
    DeployedServiceDetails,
    MigrateRequest,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { Tab } from 'rc-tabs/lib/interface';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { getBillingModes, getDefaultBillingMode } from '../formDataHelpers/billingHelper';
export const SelectMigrationTarget = ({
    target,
    setTarget,
    currentSelectedService,
    userOrderableServiceVoList,
    setCspList,
    setSelectCsp,
    setServiceHostTypes,
    setSelectServiceHostingType,
    setAreaList,
    setSelectArea,
    setRegionList,
    setSelectRegion,
    setBillingModes,
    setSelectBillingMode,
    setCurrentMigrationStep,
    stepItem,
}: {
    target: string | undefined;
    setTarget: Dispatch<SetStateAction<string | undefined>>;
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    userOrderableServiceVoList: UserOrderableServiceVo[];
    setCspList: Dispatch<SetStateAction<UserOrderableServiceVo.csp[]>>;
    setSelectCsp: Dispatch<SetStateAction<UserOrderableServiceVo.csp>>;
    setServiceHostTypes: Dispatch<SetStateAction<UserOrderableServiceVo.serviceHostingType[]>>;
    setSelectServiceHostingType: Dispatch<SetStateAction<UserOrderableServiceVo.serviceHostingType>>;
    setAreaList: Dispatch<SetStateAction<Tab[]>>;
    setSelectArea: Dispatch<SetStateAction<string>>;
    setRegionList: Dispatch<SetStateAction<RegionDropDownInfo[]>>;
    setSelectRegion: Dispatch<SetStateAction<string>>;
    setBillingModes: Dispatch<SetStateAction<MigrateRequest.billingMode[] | undefined>>;
    setSelectBillingMode: Dispatch<SetStateAction<MigrateRequest.billingMode>>;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const onChange = (e: RadioChangeEvent) => {
        setTarget(e.target.value as string);
        const cspList: UserOrderableServiceVo.csp[] = getCspList(e);
        setCspList(cspList);
        setSelectCsp(cspList[0]);
        const serviceHostTypes: UserOrderableServiceVo.serviceHostingType[] = getAvailableServiceHostingTypes(
            cspList[0],
            userOrderableServiceVoList
        );
        setServiceHostTypes(serviceHostTypes);
        setSelectServiceHostingType(serviceHostTypes[0]);
        const areaList: Tab[] = convertAreasToTabs(cspList[0], serviceHostTypes[0], userOrderableServiceVoList);
        setAreaList(areaList);
        setSelectArea(areaList[0].key);
        const regionList: RegionDropDownInfo[] = getRegionList(
            e,
            cspList[0],
            serviceHostTypes[0],
            areaList[0].key,
            userOrderableServiceVoList
        );
        setRegionList(regionList);
        setSelectRegion(regionList.length > 0 ? regionList[0].value : currentSelectedService.deployRequest.region.name);
        const billingModes: MigrateRequest.billingMode[] | undefined = getBillingModes(
            cspList[0],
            serviceHostTypes[0],
            userOrderableServiceVoList
        );
        setBillingModes(billingModes);
        const defaultBillingMode: MigrateRequest.billingMode | undefined = getDefaultBillingMode(
            cspList[0],
            serviceHostTypes[0],
            userOrderableServiceVoList
        );
        setSelectBillingMode(
            defaultBillingMode
                ? defaultBillingMode
                : billingModes
                  ? billingModes[0]
                  : (currentSelectedService.deployRequest.billingMode as MigrateRequest.billingMode)
        );
    };

    const getRegionList = (
        e: RadioChangeEvent,
        selectCsp: UserOrderableServiceVo.csp,
        selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
        selectArea: string,
        userOrderableServices: UserOrderableServiceVo[] | undefined
    ) => {
        let regions: RegionDropDownInfo[] = [];
        const regionList: RegionDropDownInfo[] = getRegionDropDownValues(
            selectCsp,
            selectServiceHostingType,
            selectArea,
            userOrderableServices
        );
        if (e.target.value === 'csp') {
            regions = regionList;
        } else {
            regionList.forEach((region) => {
                if (region.value !== currentSelectedService.deployRequest.region.name) {
                    regions.push(region);
                }
            });
        }
        return regions;
    };

    const getCspList = (e: RadioChangeEvent) => {
        const currentCspList: UserOrderableServiceVo.csp[] = [];
        if (e.target.value === 'csp') {
            userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
                if (
                    !currentCspList.includes(userOrderableServiceVo.csp) &&
                    userOrderableServiceVo.csp !== currentSelectedService.csp
                ) {
                    currentCspList.push(userOrderableServiceVo.csp);
                }
            });
        } else {
            currentCspList.push(currentSelectedService.csp);
        }
        return currentCspList;
    };

    const next = () => {
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.SelectADestination);
    };

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
    };

    return (
        <>
            <>
                <Form form={form} layout='vertical' autoComplete='off' onFinish={next} validateTrigger={['next']}>
                    <div className={'order-select-migrate-target'}>
                        <div className={'order-param-item-left'} />
                        <div className={'order-param-item-content'}>
                            <Form.Item
                                name='Choose the migration Destination'
                                label='Choose the migration Destination'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the type of migration you wish to perform.',
                                    },
                                ]}
                            >
                                <Radio.Group onChange={onChange} value={target}>
                                    <Radio value={'region'}>
                                        Migrate service to a different region offered by the same cloud service
                                        provider.
                                    </Radio>
                                    {userOrderableServiceVoList.length > 1 ? (
                                        <Radio value={'csp'}>
                                            Migrate service to a different cloud service provider.
                                        </Radio>
                                    ) : null}
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </div>
                    <div className={'migrate-step-button-inner-class'}>
                        <Space size={'large'}>
                            <Button
                                type='primary'
                                className={'migrate-steps-operation-button-clas'}
                                onClick={() => {
                                    prev();
                                }}
                            >
                                Previous
                            </Button>
                            <Button type='primary' className={'migrate-steps-operation-button-clas'} htmlType='submit'>
                                Next
                            </Button>
                        </Space>
                    </div>
                </Form>
            </>
        </>
    );
};
