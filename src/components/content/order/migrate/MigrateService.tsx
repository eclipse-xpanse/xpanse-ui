/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Image, Popconfirm, Select, Space, Tabs } from 'antd';
import {
    Billing,
    CloudServiceProvider,
    CreateRequest,
    ServiceService,
    ServiceVo,
    UserAvailableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import { cspMap } from '../formElements/CspSelect';
import {
    getBilling,
    getCreateRequest,
    getDeployParams,
    getFlavorList,
    MigrationStatus,
    MigrationSteps,
} from '../formElements/CommonTypes';
import { currencyMapper } from '../../../utils/currency';
import { OrderSubmitProps } from '../create/OrderSubmit';
import { useMutation } from '@tanstack/react-query';
import MigrateServiceStatusPolling from './MigrateServiceStatusPolling';

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
    selectCsp: CloudServiceProvider.name | undefined;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    deployParams: Record<string, never> | undefined;
    getMigrateModalOpenStatus: (isMigrateModalOpen: boolean) => void;
    currentSelectedService: ServiceVo | undefined;
    getCurrentMigrationStepStatus: (migrateStatus: MigrationStatus | undefined) => void;
}): JSX.Element => {
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    const [destroyUuid, setDestroyUuid] = useState<string>('');
    const [isMigrateTipShow, setIsMigrateTipShow] = useState<boolean>(false);
    const [migrating, setMigrating] = useState<boolean>(false);
    const [migrateDisable, setMigrateDisable] = useState<boolean>(false);
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(
        MigrationSteps.DestroyTheOldService
    );
    const [currentMigrationStepStatus, setCurrentMigrationStepStatus] = useState<MigrationStatus | undefined>(
        undefined
    );
    const areaList: Tab[] = [{ key: selectArea, label: selectArea, disabled: true }];
    const currentFlavorList: { value: string; label: string; price: string }[] =
        getFlavorList(userAvailableServiceVoList);
    const currentBilling: Billing = getBilling(
        userAvailableServiceVoList,
        selectCsp === undefined ? CloudServiceProvider.name.OPENSTACK : selectCsp
    );
    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });

    useEffect(() => {
        if (currentMigrationStepStatus === undefined) {
            return;
        }
        getCurrentMigrationStepStatus(currentMigrationStepStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStepStatus]);

    const migrate = () => {
        setMigrating(true);
        setMigrateDisable(true);
        setIsPreviousDisabled(true);
        setCurrentMigrationStepStatus(MigrationStatus.Processing);
        setIsMigrateTipShow(true);
        startMigrating();
    };

    const startMigrating = () => {
        if (currentSelectedService === undefined || deployParams === undefined) {
            return;
        }
        let customerServiceName = '';
        Object.keys(deployParams).forEach(function (key) {
            if (key === 'Name') {
                customerServiceName = deployParams[key];
            }
        });
        const props: OrderSubmitProps = getDeployParams(
            userAvailableServiceVoList,
            selectCsp,
            selectArea,
            selectRegion,
            selectFlavor
        );
        const createRequest: CreateRequest = getCreateRequest(props, customerServiceName);
        deployServiceRequest.mutate(createRequest);
    };

    const deployServiceRequest = useMutation({
        mutationFn: (createRequest: CreateRequest) => {
            return ServiceService.deploy(createRequest);
        },
        onSuccess: () => {
            destroy();
        },
        onError: (error: Error) => {
            console.error(error);
            setMigrating(false);
            setMigrateDisable(false);
            setIsPreviousDisabled(false);
            setCurrentMigrationStepStatus(MigrationStatus.Failed);
        },
    });

    const destroy = () => {
        if (currentSelectedService === undefined) {
            return;
        }
        setDestroyUuid(currentSelectedService.id);
        destroyServiceRequest.mutate(currentSelectedService.id);
    };

    const destroyServiceRequest = useMutation({
        mutationFn: (id: string) => {
            return ServiceService.destroy(id);
        },
        onSuccess: () => {
            setMigrating(false);
            setCurrentMigrationStepStatus(MigrationStatus.Finished);
        },
        onError: (error: Error) => {
            console.error(error);
            setMigrating(false);
            setMigrateDisable(false);
            setIsPreviousDisabled(false);
            setCurrentMigrationStepStatus(MigrationStatus.Failed);
        },
    });

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
        getCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    return (
        <>
            {isMigrateTipShow ? (
                <MigrateServiceStatusPolling
                    deployUuid={deployServiceRequest.data}
                    deployError={deployServiceRequest.error ?? undefined}
                    destroyUuid={destroyUuid}
                    destroyError={deployServiceRequest.error ?? undefined}
                    isDeployLoading={deployServiceRequest.isLoading}
                    isDesployLoading={deployServiceRequest.isLoading}
                    setMigrating={setMigrating}
                    setMigrateDisable={setMigrateDisable}
                />
            ) : null}
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            <div className={'services-content-body'}>
                <div className={'cloud-provider-select-hover'}>
                    <Image
                        width={200}
                        height={56}
                        src={
                            cspMap.get(selectCsp === undefined ? CloudServiceProvider.name.OPENSTACK : selectCsp)?.logo
                        }
                        alt={selectCsp}
                        preview={false}
                        fallback={
                            'https://img.shields.io/badge/-' +
                            (selectCsp === undefined ? '' : selectCsp.toString()) +
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
                                loading={migrating}
                                disabled={migrateDisable}
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
