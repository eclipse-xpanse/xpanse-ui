/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Form, Image, Popconfirm, Space, StepProps, Tabs } from 'antd';
import {
    Billing,
    CloudServiceProvider,
    DeployedService,
    DeployRequest,
    MigrateRequest,
    Region,
    ServiceMigrationDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import MigrateServiceStatusAlert from './MigrateServiceStatusAlert';
import { cspMap } from '../../common/csp/CspLogo';
import { Flavor } from '../types/Flavor';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { getBilling } from '../formDataHelpers/billingHelper';
import { MigrationSteps } from '../types/MigrationSteps';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { BillingInfo } from '../common/BillingInfo';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';
import {
    useMigrateServiceDetailsPollingQuery,
    useMigrateServiceQuery,
    useServiceDetailsPollingQuery,
} from './useMigrateServiceQuery';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import { getAvailabilityZoneConfigs } from '../formDataHelpers/getAvailabilityZoneConfigs';
import { MigrateServiceSubmitAvailabilityZoneInfo } from '../common/MigrateServiceSubmitAvailabilityZoneInfo';
import migrationStatus = ServiceMigrationDetails.migrationStatus;

export const MigrateServiceSubmit = ({
    userOrderableServiceVoList,
    selectCsp,
    region,
    availabilityZones,
    selectFlavor,
    selectServiceHostingType,
    setCurrentMigrationStep,
    deployParams,
    currentSelectedService,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: UserOrderableServiceVo.csp;
    region: Region;
    availabilityZones: Record<string, string>;
    selectFlavor: string;
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    deployParams: DeployRequest | undefined;
    currentSelectedService: DeployedService;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);

    const areaList: Tab[] = [{ key: region.area, label: region.area, disabled: true }];
    const currentFlavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostingType, userOrderableServiceVoList);
    const currentBilling: Billing = getBilling(selectCsp, selectServiceHostingType, userOrderableServiceVoList);
    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });
    const migrateServiceRequest = useMigrateServiceQuery();
    const migrateServiceDetailsQuery = useMigrateServiceDetailsPollingQuery(
        migrateServiceRequest.data,
        migrateServiceRequest.isSuccess,
        [
            ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED,
            ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED,
            ServiceMigrationDetails.migrationStatus.DESTROY_FAILED,
            ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED,
            ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED,
            ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED,
        ]
    );
    const deployServiceDetailsQuery = useServiceDetailsPollingQuery(
        migrateServiceDetailsQuery.data?.newServiceId,
        selectServiceHostingType,
        migrateServiceDetailsQuery.data?.migrationStatus
    );
    const destroyServiceDetailsQuery = useServiceDetailsPollingQuery(
        currentSelectedService.id,
        currentSelectedService.serviceHostingType,
        migrateServiceDetailsQuery.data?.migrationStatus
    );

    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(currentSelectedService.serviceTemplateId);

    const migrate = () => {
        if (deployParams !== undefined) {
            const migrateRequest: MigrateRequest = deployParams as MigrateRequest;
            migrateRequest.region = region;
            migrateRequest.id = currentSelectedService.id;
            migrateServiceRequest.mutate(migrateRequest);
            stepItem.status = 'process';
            setIsShowDeploymentResult(true);
        }
    };
    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    if (migrateServiceDetailsQuery.data) {
        if (migrateServiceDetailsQuery.data.migrationStatus === migrationStatus.MIGRATION_COMPLETED) {
            stepItem.status = 'finish';
        } else if (
            migrateServiceDetailsQuery.data.migrationStatus ===
                ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED ||
            migrateServiceDetailsQuery.data.migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED ||
            migrateServiceDetailsQuery.data.migrationStatus ===
                ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED ||
            migrateServiceDetailsQuery.data.migrationStatus ===
                ServiceMigrationDetails.migrationStatus.DESTROY_FAILED ||
            migrateServiceDetailsQuery.data.migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED
        ) {
            stepItem.status = 'error';
        } else {
            stepItem.status = 'process';
        }
    }
    return (
        <>
            {isShowDeploymentResult ? (
                <MigrateServiceStatusAlert
                    migrateRequestError={migrateServiceRequest.error}
                    deployedServiceDetails={deployServiceDetailsQuery.data}
                    oldDeployedServiceDetails={destroyServiceDetailsQuery.data}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                    isPollingError={migrateServiceDetailsQuery.isError}
                    migrationDetails={migrateServiceDetailsQuery.data}
                />
            ) : null}
            <Form layout='vertical' initialValues={{ region, selectFlavor }}>
                <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
                <div className={'services-content-body'}>
                    <div className={'cloud-provider-select-hover'}>
                        <Image
                            width={200}
                            height={56}
                            src={cspMap.get(selectCsp as unknown as CloudServiceProvider.name)?.logo}
                            alt={selectCsp}
                            preview={false}
                            fallback={
                                'https://img.shields.io/badge/-' +
                                (selectCsp.length === 0 ? '' : selectCsp.toString()) +
                                '-gray'
                            }
                        />
                        <div className='service-type-option-info' />
                    </div>
                </div>
                <br />
                <ServiceHostingSelection
                    serviceHostingTypes={[selectServiceHostingType]}
                    disabledAlways={true}
                    previousSelection={undefined}
                ></ServiceHostingSelection>
                <br />
                <br />
                <div className={'cloud-provider-tab-class content-title'}>
                    <Tabs type='card' size='middle' activeKey={region.area} tabPosition={'top'} items={areaList} />
                </div>
                <RegionInfo selectRegion={region.name} disabled={true} />
                {Object.keys(availabilityZones).length > 0 ? (
                    <MigrateServiceSubmitAvailabilityZoneInfo
                        availabilityZoneConfigs={getAvailabilityZoneConfigs(selectCsp, userOrderableServiceVoList)}
                        availabilityZones={availabilityZones}
                    />
                ) : undefined}
                <FlavorInfo selectFlavor={selectFlavor} disabled={true} />
                <BillingInfo priceValue={priceValue} billing={currentBilling} />
                <div className={'migrate-step-button-inner-class'}>
                    <Space size={'large'}>
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                prev();
                            }}
                            disabled={stepItem.status === 'finish' || stepItem.status === 'process'}
                        >
                            Previous
                        </Button>
                        <Popconfirm
                            title='Migrate service'
                            description='Are you sure to migrate service?'
                            okText='No'
                            cancelText='Yes'
                            onCancel={migrate}
                        >
                            <Button
                                type='primary'
                                className={'migrate-steps-operation-button-clas'}
                                loading={stepItem.status === 'process'}
                                disabled={stepItem.status === 'finish' || stepItem.status === 'process'}
                            >
                                Migrate
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            </Form>
        </>
    );
};
