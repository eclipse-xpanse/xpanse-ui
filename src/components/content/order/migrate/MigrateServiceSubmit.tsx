/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Image, Popconfirm, Select, Space, Tabs } from 'antd';
import {
    Billing,
    CloudServiceProvider,
    DeployRequest,
    MigrateRequest,
    ServiceVo,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import { currencyMapper } from '../../../utils/currency';
import { useMigrateServiceQuery } from './useMigrateServiceQuery';
import MigrateServiceStatusPolling from './MigrateServiceStatusPolling';
import { cspMap } from '../types/CspLogo';
import { Flavor } from '../types/Flavor';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { getBilling } from '../formDataHelpers/billingHelper';
import { MigrationStatus } from '../types/MigrationStatus';
import { MigrationSteps } from '../types/MigrationSteps';
import { ServiceHostingSelection } from '../create/ServiceHostingSelection';

export const MigrateServiceSubmit = ({
    userOrderableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    selectServiceHostingType,
    getCurrentMigrationStep,
    deployParams,
    currentSelectedService,
    getCurrentMigrationStepStatus,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: UserOrderableServiceVo.csp;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    deployParams: DeployRequest | undefined;
    currentSelectedService: ServiceVo | undefined;
    getCurrentMigrationStepStatus: (migrateStatus: MigrationStatus | undefined) => void;
}): React.JSX.Element => {
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const [isMigrating, setIsMigrating] = useState<boolean>(false);
    const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(
        MigrationSteps.DestroyTheOldService
    );

    const areaList: Tab[] = [{ key: selectArea, label: selectArea, disabled: true }];
    const currentFlavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostingType, userOrderableServiceVoList);
    const currentBilling: Billing = getBilling(selectCsp, selectServiceHostingType, userOrderableServiceVoList);
    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });

    const migrateServiceRequest = useMigrateServiceQuery();

    const migrate = () => {
        if (deployParams !== undefined) {
            const migrateRequest: MigrateRequest = deployParams as MigrateRequest;
            migrateRequest.id = currentSelectedService === undefined ? '' : currentSelectedService.id;
            setIsMigrating(true);
            setRequestSubmitted(true);
            setIsPreviousDisabled(true);
            migrateServiceRequest.mutate(migrateRequest);
            setIsShowDeploymentResult(true);
        }
    };

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
        getCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    return (
        <>
            {isShowDeploymentResult ? (
                <MigrateServiceStatusPolling
                    destroyUuid={currentSelectedService?.id}
                    deployUuid={migrateServiceRequest.data}
                    isMigrateSuccess={migrateServiceRequest.isSuccess}
                    error={migrateServiceRequest.error}
                    isLoading={migrateServiceRequest.isPending}
                    setIsMigrating={setIsMigrating}
                    setRequestSubmitted={setRequestSubmitted}
                    setIsPreviousDisabled={setIsPreviousDisabled}
                    getCurrentMigrationStepStatus={getCurrentMigrationStepStatus}
                />
            ) : null}
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
                <Tabs type='card' size='middle' activeKey={selectArea} tabPosition={'top'} items={areaList} />
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class select-cloud-provider-class'}
                        defaultValue={selectRegion}
                        value={selectRegion}
                        disabled={true}
                    />
                </Space>
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class select-cloud-provider-class'}
                        value={selectFlavor}
                        disabled={true}
                    />
                </Space>
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                Price:&nbsp;
                <span className={'services-content-price-class'}>
                    {priceValue}&nbsp;{currencyMapper[currentBilling.currency]}
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
                    {currentMigrationStep === MigrationSteps.DestroyTheOldService ? (
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
                                loading={isMigrating}
                                disabled={requestSubmitted}
                            >
                                Migrate
                            </Button>
                        </Popconfirm>
                    ) : (
                        <></>
                    )}
                </Space>
            </div>
        </>
    );
};
