/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Image, Popconfirm, Select, Space, Tabs } from 'antd';
import {
    Billing,
    CloudServiceProvider,
    CreateRequest,
    ServiceVo,
    UserAvailableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import { cspMap } from '../formElements/CspSelect';
import {
    getBilling,
    getFlavorListByCsp,
    getFlavorMapper,
    MigrationStatus,
    MigrationSteps,
} from '../formElements/CommonTypes';
import { currencyMapper } from '../../../utils/currency';
import { MigrateServiceStatusPolling } from './MigrateServiceStatusPolling';
import { useDeployRequestSubmitQuery } from '../create/useDeployRequestSubmitQuery';

export const MigrateService = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    getCurrentMigrationStep,
    deployParams,
    currentSelectedService,
    getCurrentMigrationStepStatus,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    selectCsp: string;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    deployParams: CreateRequest | undefined;
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
    const currentFlavorList: { value: string; label: string; price: string }[] = getFlavorListByCsp(
        getFlavorMapper(userAvailableServiceVoList),
        selectCsp
    );
    const currentBilling: Billing = getBilling(
        userAvailableServiceVoList,
        selectCsp.length === 0 ? CloudServiceProvider.name.OPENSTACK : selectCsp
    );
    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });

    const deployServiceRequest = useDeployRequestSubmitQuery();

    const migrate = () => {
        if (deployParams !== undefined) {
            setIsMigrating(true);
            setRequestSubmitted(true);
            setIsPreviousDisabled(true);
            deployServiceRequest.mutate(deployParams);
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
                    currentSelectedService={currentSelectedService}
                    deployData={deployServiceRequest.data}
                    isDeploySuccess={deployServiceRequest.isSuccess}
                    isDeployError={deployServiceRequest.isError}
                    deployError={deployServiceRequest.error as Error}
                    isDeployLoading={deployServiceRequest.isLoading}
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
                        src={
                            cspMap.get(
                                selectCsp.length === 0
                                    ? CloudServiceProvider.name.OPENSTACK
                                    : (selectCsp as CloudServiceProvider.name)
                            )?.logo
                        }
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
                            onClick={() => prev()}
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
                            okText='Yes'
                            cancelText='No'
                            onConfirm={migrate}
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
