/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseQueryResult } from '@tanstack/react-query';
import { Button, Form, Popconfirm, Space, StepProps, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    billingMode,
    csp,
    DeployedService,
    DeployRequest,
    Region,
    ServiceFlavor,
    serviceHostingType,
    ServicePortingRequest,
    taskStatus,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import useGetOrderableServiceDetailsByServiceIdQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsByServiceIdQuery.ts';
import { FlavorSelection } from '../common/FlavorSelection.tsx';
import { PortServiceSubmitAvailabilityZoneInfo } from '../common/PortServiceSubmitAvailabilityZoneInfo.tsx';
import { PortServiceSubmitBillingMode } from '../common/PortServiceSubmitBillingMode.tsx';
import { RegionSelection } from '../common/RegionSelection.tsx';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { getServiceFlavorList } from '../formDataHelpers/flavorHelper';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import CspSelect from '../formElements/CspSelect';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';
import PortServiceStatusAlert from './PortServiceStatusAlert.tsx';
import { usePortServiceRequest } from './usePortServiceRequest.ts';

export const PortServiceSubmit = ({
    userOrderableServiceVoList,
    selectCsp,
    region,
    availabilityZones,
    selectFlavor,
    selectServiceHostingType,
    selectBillingMode,
    setCurrentPortingStep,
    deployParams,
    currentSelectedService,
    stepItem,
    getServicePriceQuery,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: csp;
    region: Region;
    availabilityZones: Record<string, string>;
    selectFlavor: string;
    selectServiceHostingType: serviceHostingType;
    selectBillingMode: billingMode;
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    deployParams: DeployRequest | undefined;
    currentSelectedService: DeployedService;
    stepItem: StepProps;
    getServicePriceQuery: UseQueryResult<ServiceFlavorWithPriceResult[]>;
}): React.JSX.Element => {
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);

    const areaList: Tab[] = [{ key: region.area, label: region.area, disabled: true }];
    const currentFlavorList: ServiceFlavor[] = getServiceFlavorList(
        selectCsp,
        selectServiceHostingType,
        userOrderableServiceVoList
    );

    const portServiceRequest = usePortServiceRequest();

    const getPortLatestServiceOrderStatusQuery = useLatestServiceOrderStatusQuery(
        portServiceRequest.data?.orderId ?? '',
        portServiceRequest.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const deployServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        portServiceRequest.data?.serviceId ?? '',
        selectServiceHostingType,
        getPortLatestServiceOrderStatusQuery.data?.taskStatus
    );

    const getOrderableServiceDetails = useGetOrderableServiceDetailsByServiceIdQuery(currentSelectedService.serviceId);

    const port = () => {
        if (deployParams !== undefined) {
            const servicePortingRequest: ServicePortingRequest = deployParams as ServicePortingRequest;
            servicePortingRequest.region = region;
            servicePortingRequest.originalServiceId = currentSelectedService.serviceId;
            servicePortingRequest.billingMode = selectBillingMode;
            portServiceRequest.mutate(servicePortingRequest);
            stepItem.status = 'process';
            setIsShowDeploymentResult(true);
        }
    };
    const previous = () => {
        setCurrentPortingStep(ServicePortingSteps.ImportServiceData);
    };

    if (portServiceRequest.isError) {
        stepItem.status = 'error';
    } else if (portServiceRequest.isPending) {
        stepItem.status = 'process';
    } else {
        if (getPortLatestServiceOrderStatusQuery.data) {
            if (getPortLatestServiceOrderStatusQuery.data.taskStatus === taskStatus.SUCCESSFUL) {
                stepItem.status = 'finish';
            } else if (getPortLatestServiceOrderStatusQuery.data.taskStatus === taskStatus.FAILED) {
                stepItem.status = 'error';
            } else {
                stepItem.status = 'process';
            }
        }
    }

    return (
        <>
            {isShowDeploymentResult ? (
                <PortServiceStatusAlert
                    selectServiceHostingType={selectServiceHostingType}
                    portServiceRequest={portServiceRequest}
                    deployedServiceDetails={deployServiceDetailsQuery.data}
                    getPortLatestServiceOrderStatusQuery={getPortLatestServiceOrderStatusQuery}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            <Form
                layout='inline'
                initialValues={{ region, selectFlavor }}
                className={serviceOrderStyles.orderFormInlineDisplay}
            >
                <div className={tableStyles.genericTableContainer}>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <CspSelect selectCsp={selectCsp} cspList={[]} onChangeHandler={undefined} />
                        <br />
                        <ServiceHostingSelection
                            serviceHostingTypes={[selectServiceHostingType]}
                            disabledAlways={true}
                            previousSelection={undefined}
                        />
                    </div>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <div
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${appStyles.contentTitle}  ${serviceOrderStyles.orderFormSelectionFirstInGroup}`}
                        >
                            <Tabs
                                type='card'
                                size='middle'
                                activeKey={region.area}
                                tabPosition={'top'}
                                items={areaList}
                            />
                        </div>
                        <RegionSelection selectArea={region.area} selectRegion={region} disabled={true} />
                        <PortServiceSubmitAvailabilityZoneInfo
                            availabilityZoneConfigs={getAvailabilityZoneRequirementsForAService(
                                selectCsp,
                                userOrderableServiceVoList
                            )}
                            availabilityZones={availabilityZones}
                        />
                    </div>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <PortServiceSubmitBillingMode selectBillMode={selectBillingMode} />
                        <FlavorSelection
                            selectFlavor={selectFlavor}
                            flavorList={currentFlavorList}
                            getServicePriceQuery={getServicePriceQuery}
                        />
                    </div>
                </div>
                <div className={serviceOrderStyles.portingStepButtonInnerClass}>
                    <Space size={'large'}>
                        <Button
                            type='primary'
                            onClick={() => {
                                previous();
                            }}
                            disabled={stepItem.status === 'finish' || stepItem.status === 'process'}
                        >
                            Previous
                        </Button>
                        <Popconfirm
                            title='Port service'
                            description='Are you sure to port service?'
                            okText='No'
                            cancelText='Yes'
                            onCancel={port}
                        >
                            <Button
                                type='primary'
                                loading={stepItem.status === 'process'}
                                disabled={stepItem.status === 'finish' || stepItem.status === 'process'}
                            >
                                Port
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            </Form>
        </>
    );
};
