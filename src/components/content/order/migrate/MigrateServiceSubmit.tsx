/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Form, Image, Popconfirm, Space, StepProps, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    CloudServiceProvider,
    DeployRequest,
    DeployedService,
    MigrateRequest,
    Region,
    ServiceFlavor,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { cspMap } from '../../common/csp/CspLogo';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import { FlavorSelection } from '../common/FlavorSelection.tsx';
import { MigrateServiceSubmitAvailabilityZoneInfo } from '../common/MigrateServiceSubmitAvailabilityZoneInfo';
import { MigrateServiceSubmitBillingMode } from '../common/MigrateServiceSubmitBillingMode';
import { RegionSelection } from '../common/RegionSelection.tsx';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { getServiceFlavorList } from '../formDataHelpers/flavorHelper';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import { MigrationSteps } from '../types/MigrationSteps';
import MigrateServiceStatusAlert from './MigrateServiceStatusAlert';
import {
    useMigrateServiceDetailsPollingQuery,
    useMigrateServiceQuery,
    useServiceDetailsPollingQuery,
} from './useMigrateServiceQuery';

export const MigrateServiceSubmit = ({
    userOrderableServiceVoList,
    selectCsp,
    region,
    availabilityZones,
    selectFlavor,
    selectServiceHostingType,
    selectBillingMode,
    setCurrentMigrationStep,
    deployParams,
    currentSelectedService,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: UserOrderableServiceVo['csp'];
    region: Region;
    availabilityZones: Record<string, string>;
    selectFlavor: string;
    selectServiceHostingType: UserOrderableServiceVo['serviceHostingType'];
    selectBillingMode: MigrateRequest['billingMode'];
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    deployParams: DeployRequest | undefined;
    currentSelectedService: DeployedService;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);

    const areaList: Tab[] = [{ key: region.area, label: region.area, disabled: true }];
    const currentFlavorList: ServiceFlavor[] = getServiceFlavorList(
        selectCsp,
        selectServiceHostingType,
        userOrderableServiceVoList
    );
    const migrateServiceRequest = useMigrateServiceQuery();
    const migrateServiceDetailsQuery = useMigrateServiceDetailsPollingQuery(
        migrateServiceRequest.data,
        migrateServiceRequest.isSuccess,
        ['MigrationStarted', 'MigrationFailed', 'DestroyFailed', 'DataImportFailed', 'DeployFailed', 'DataExportFailed']
    );
    const deployServiceDetailsQuery = useServiceDetailsPollingQuery(
        migrateServiceDetailsQuery.data?.newServiceId,
        selectServiceHostingType,
        migrateServiceDetailsQuery.data?.migrationStatus
    );
    const destroyServiceDetailsQuery = useServiceDetailsPollingQuery(
        currentSelectedService.serviceId,
        currentSelectedService.serviceHostingType,
        migrateServiceDetailsQuery.data?.migrationStatus
    );

    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(currentSelectedService.serviceTemplateId);

    const migrate = () => {
        if (deployParams !== undefined) {
            const migrateRequest: MigrateRequest = deployParams as MigrateRequest;
            migrateRequest.region = region;
            migrateRequest.originalServiceId = currentSelectedService.serviceId;
            migrateRequest.billingMode = selectBillingMode;
            migrateServiceRequest.mutate(migrateRequest);
            stepItem.status = 'process';
            setIsShowDeploymentResult(true);
        }
    };
    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    if (migrateServiceDetailsQuery.data) {
        if (migrateServiceDetailsQuery.data.migrationStatus.toString() === 'MigrationCompleted') {
            stepItem.status = 'finish';
        } else if (
            migrateServiceDetailsQuery.data.migrationStatus.toString() === 'DataExportFailed' ||
            migrateServiceDetailsQuery.data.migrationStatus.toString() === 'DeployFailed' ||
            migrateServiceDetailsQuery.data.migrationStatus.toString() === 'DataImportFailed' ||
            migrateServiceDetailsQuery.data.migrationStatus.toString() === 'DestroyFailed' ||
            migrateServiceDetailsQuery.data.migrationStatus.toString() === 'MigrationFailed'
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
            <Form
                layout='inline'
                initialValues={{ region, selectFlavor }}
                className={serviceOrderStyles.orderFormInlineDisplay}
            >
                <div className={tableStyles.genericTableContainer}>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <div className={serviceOrderStyles.orderFormFlexElements}>
                            <div
                                className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                            >
                                Cloud Service Provider:
                            </div>
                            <div className={serviceOrderStyles.servicesContentBody}>
                                <div className={serviceOrderStyles.cloudProviderSelectHover}>
                                    <Image
                                        width={200}
                                        height={56}
                                        src={cspMap.get(selectCsp as unknown as CloudServiceProvider['name'])?.logo}
                                        alt={selectCsp}
                                        preview={false}
                                        fallback={
                                            'https://img.shields.io/badge/-' +
                                            (selectCsp.length === 0 ? '' : selectCsp.toString()) +
                                            '-gray'
                                        }
                                    />
                                    <div className={serviceOrderStyles.serviceTypeOptionInfo} />
                                </div>
                            </div>
                        </div>
                        <br />
                        <ServiceHostingSelection
                            serviceHostingTypes={[selectServiceHostingType]}
                            disabledAlways={true}
                            previousSelection={undefined}
                        ></ServiceHostingSelection>
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
                        <RegionSelection selectRegion={region.name} disabled={true} />
                        <MigrateServiceSubmitAvailabilityZoneInfo
                            availabilityZoneConfigs={getAvailabilityZoneRequirementsForAService(
                                selectCsp,
                                userOrderableServiceVoList
                            )}
                            availabilityZones={availabilityZones}
                        />
                    </div>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <MigrateServiceSubmitBillingMode selectBillMode={selectBillingMode} />
                        <FlavorSelection
                            selectFlavor={selectFlavor}
                            flavorList={currentFlavorList}
                            selectVersion={currentSelectedService.version}
                            selectCsp={selectCsp}
                            selectRegion={region.name}
                            selectBillingMode={selectBillingMode}
                        />
                    </div>
                </div>
                <div className={serviceOrderStyles.migrateStepButtonInnerClass}>
                    <Space size={'large'}>
                        <Button
                            type='primary'
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
