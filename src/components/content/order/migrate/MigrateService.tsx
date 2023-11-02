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
import { cspMap } from '../formElements/CspSelect';
import {
    getBilling,
    getFlavorListByCsp,
    getFlavorMapper,
    MigrationStatus,
    MigrationSteps,
} from '../formElements/CommonTypes';
import { currencyMapper } from '../../../utils/currency';
import { useMigrateServiceQuery } from './useMigrateServiceQuery';
import MigrateServiceStatusPolling from './MigrateServiceStatusPolling';

export const MigrateService = ({
    userOrderableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    getCurrentMigrationStep,
    deployParams,
    currentSelectedService,
    getCurrentMigrationStepStatus,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: string;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
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
    const currentFlavorList: { value: string; label: string; price: string }[] = getFlavorListByCsp(
        getFlavorMapper(userOrderableServiceVoList),
        selectCsp
    );
    const currentBilling: Billing = getBilling(
        userOrderableServiceVoList,
        selectCsp.length === 0 ? CloudServiceProvider.name.OPENSTACK : selectCsp
    );
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
