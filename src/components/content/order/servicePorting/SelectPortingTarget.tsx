/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Form, Radio, RadioChangeEvent, Space, StepProps } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { Dispatch, SetStateAction } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    DeployedServiceDetails,
    Region,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
    billingMode,
    csp,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getBillingModes, getDefaultBillingMode } from '../formDataHelpers/billingHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';

export const SelectPortingTarget = ({
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
    setCurrentPortingStep,
    stepItem,
}: {
    target: string | undefined;
    setTarget: Dispatch<SetStateAction<string | undefined>>;
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    userOrderableServiceVoList: UserOrderableServiceVo[];
    setCspList: Dispatch<SetStateAction<csp[]>>;
    setSelectCsp: Dispatch<SetStateAction<csp>>;
    setServiceHostTypes: Dispatch<SetStateAction<serviceHostingType[]>>;
    setSelectServiceHostingType: Dispatch<SetStateAction<serviceHostingType>>;
    setAreaList: Dispatch<SetStateAction<Tab[]>>;
    setSelectArea: Dispatch<SetStateAction<string>>;
    setRegionList: Dispatch<SetStateAction<RegionDropDownInfo[]>>;
    setSelectRegion: Dispatch<SetStateAction<Region>>;
    setBillingModes: Dispatch<SetStateAction<billingMode[] | undefined>>;
    setSelectBillingMode: Dispatch<SetStateAction<billingMode>>;
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const onChange = (e: RadioChangeEvent) => {
        setTarget(e.target.value as string);
        const cspList: csp[] = getCspList(e);
        setCspList(cspList);
        setSelectCsp(cspList[0]);
        const serviceHostTypes: serviceHostingType[] = getAvailableServiceHostingTypes(
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
        setSelectRegion(regionList.length > 0 ? regionList[0].region : currentSelectedService.deployRequest.region);
        const billingModes: billingMode[] | undefined = getBillingModes(
            cspList[0],
            serviceHostTypes[0],
            userOrderableServiceVoList
        );
        setBillingModes(billingModes);
        const defaultBillingMode: billingMode | undefined = getDefaultBillingMode(
            cspList[0],
            serviceHostTypes[0],
            userOrderableServiceVoList
        );
        setSelectBillingMode(
            defaultBillingMode
                ? defaultBillingMode
                : billingModes
                  ? billingModes[0]
                  : (currentSelectedService.deployRequest.billingMode as billingMode)
        );
    };

    const getRegionList = (
        e: RadioChangeEvent,
        selectCsp: csp,
        selectServiceHostingType: serviceHostingType,
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
        const currentCspList: csp[] = [];
        if (e.target.value === 'csp') {
            userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
                if (
                    !currentCspList.includes(userOrderableServiceVo.csp as csp) &&
                    userOrderableServiceVo.csp !== currentSelectedService.csp
                ) {
                    currentCspList.push(userOrderableServiceVo.csp as csp);
                }
            });
        } else {
            currentCspList.push(currentSelectedService.csp as csp);
        }
        return currentCspList;
    };

    const next = () => {
        stepItem.status = 'finish';
        setCurrentPortingStep(ServicePortingSteps.SelectADestination);
    };

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentPortingStep(ServicePortingSteps.ExportServiceData);
    };

    return (
        <>
            <>
                <Form form={form} layout='vertical' autoComplete='off' onFinish={next} validateTrigger={['next']}>
                    <div className={serviceOrderStyles.orderSelectPortingTarget}>
                        <div className={serviceOrderStyles.orderParamItemLeft} />
                        <div className={serviceOrderStyles.orderParamItemContent}>
                            <Form.Item
                                name='Choose the porting destination'
                                label='Choose the porting destination'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the type of porting you wish to perform.',
                                    },
                                ]}
                            >
                                <Radio.Group onChange={onChange} value={target}>
                                    <Radio value={'region'}>
                                        Port service to a different region offered by the same cloud service provider.
                                    </Radio>
                                    {userOrderableServiceVoList.length > 1 ? (
                                        <Radio value={'csp'}>Port service to a different cloud service provider.</Radio>
                                    ) : null}
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </div>
                    <div className={serviceOrderStyles.portingStepButtonInnerClass}>
                        <Space size={'large'}>
                            <Button
                                type='primary'
                                onClick={() => {
                                    prev();
                                }}
                            >
                                Previous
                            </Button>
                            <Button type='primary' htmlType='submit'>
                                Next
                            </Button>
                        </Space>
                    </div>
                </Form>
            </>
        </>
    );
};
