/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Image, Popconfirm, Select, Space, Tabs } from 'antd';
import {
    Billing,
    CloudServiceProvider,
    CreateRequest,
    ServiceDetailVo,
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
    OperationType,
} from '../formElements/CommonTypes';
import { currencyMapper } from '../../../utils/currency';
import { OrderSubmitProps } from '../OrderSubmit';
import { MigrateSubmitResult } from '../OrderSubmitResult';
import { deployTimeout, destroyTimeout, waitServicePeriod } from '../../../utils/constants';
import { ProcessingStatus } from '../ProcessingStatus';
import { MigrateSubmitFailed } from '../OrderSubmitFailed';
import { getUserName } from '../../../oidc/OidcConfig';
import { useOidcIdToken } from '@axa-fr/react-oidc';

export const MigrateService = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    getCurrentMigrationStep,
    deployParams,
    getMigrateModalOpenStatus,
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
    const [isNewServiceDeployed, setIsNewServiceDeployed] = useState<boolean>(false);
    const [isMigrating, setIsMigrating] = useState<boolean>(false);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(
        MigrationSteps.DestroyTheOldService
    );
    const [currentMigrationStepStatus, setCurrentMigrationStepStatus] = useState<MigrationStatus | undefined>(
        undefined
    );

    const [tip, setTip] = useState<JSX.Element | undefined>(undefined);
    const [isTipShowStatus, setIsTipShowStatus] = useState<boolean>(false);
    let retryDeployTimer: number | undefined = undefined;
    let retryDestroyTimer: number | undefined = undefined;

    const areaList: Tab[] = [{ key: selectArea, label: selectArea, disabled: true }];
    const currentFlavorList: { value: string; label: string; price: string }[] =
        getFlavorList(userAvailableServiceVoList);
    const currentBilling: Billing = getBilling(
        userAvailableServiceVoList,
        selectCsp === undefined ? CloudServiceProvider.name.OPENSTACK : selectCsp
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { idTokenPayload } = useOidcIdToken();

    let priceValue: string = '';
    currentFlavorList.forEach((flavorItem) => {
        if (flavorItem.value === selectFlavor) {
            priceValue = flavorItem.price;
        }
    });

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
        getCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    const TipClear = () => {
        setTip(undefined);
    };

    const migrate = () => {
        setIsMigrating(true);
        setIsPreviousDisabled(true);
        startMigrating();
    };

    useEffect(() => {
        if (currentMigrationStepStatus === undefined) {
            return;
        }
        getCurrentMigrationStepStatus(currentMigrationStepStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStepStatus]);

    const startMigrating = () => {
        if (currentSelectedService === undefined) {
            return;
        }
        setCurrentMigrationStepStatus(MigrationStatus.Processing);
        setIsMigrating(true);
        setIsPreviousDisabled(true);
        setIsTipShowStatus(true);
        if (deployParams === undefined) {
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
        ServiceService.deploy(createRequest)
            .then((uuid) => {
                setTip(MigrateSubmitResult('Request accepted', uuid, 'success'));
                waitingServiceReady(uuid, deployTimeout, new Date());
            })
            .catch((error: Error) => {
                console.error(error);
                setIsNewServiceDeployed(false);
                setIsPreviousDisabled(false);
                setIsTipShowStatus(true);
                setTip(MigrateSubmitFailed(error));
                setCurrentMigrationStepStatus(MigrationStatus.Failed);
                TipClear();
            });
    };

    const waitingServiceReady = (uuid: string, timeout: number, date: Date) => {
        setTip(
            MigrateSubmitResult(
                'Migrating, Please wait... [' +
                    Math.ceil((new Date().getTime() - date.getTime()) / 1000).toString() +
                    's]',
                uuid,
                'success'
            )
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ServiceService.getDeployedServiceDetailsById(uuid, getUserName(idTokenPayload as object)!)
            .then((response) => {
                if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Deploy as OperationType),
                            uuid,
                            'success'
                        )
                    );
                    setIsNewServiceDeployed(true);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Finished);
                    TipClear();
                    return () => {
                        clearTimeout(retryDeployTimer);
                    };
                } else if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Deploy as OperationType),
                            uuid,
                            'error'
                        )
                    );
                    setIsNewServiceDeployed(false);
                    setIsMigrating(false);
                    setIsPreviousDisabled(false);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Failed);
                    return () => {
                        clearTimeout(retryDeployTimer);
                    };
                } else {
                    retryDeployTimer = window.setTimeout(() => {
                        waitingServiceReady(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                }
            })
            .catch((error: Error) => {
                console.log('waitingServiceReady error', error);
                if (timeout > 0) {
                    retryDeployTimer = window.setTimeout(() => {
                        waitingServiceReady(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                } else {
                    setTip(MigrateSubmitFailed(error));
                    setIsNewServiceDeployed(false);
                    setIsMigrating(false);
                    setIsPreviousDisabled(false);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Failed);
                    TipClear();
                }
            });
    };

    useEffect(() => {
        if (isNewServiceDeployed) {
            destroy();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNewServiceDeployed]);

    const destroy = () => {
        setCurrentMigrationStepStatus(MigrationStatus.Processing);
        if (currentSelectedService === undefined) {
            return;
        }
        setIsPreviousDisabled(true);
        setIsTipShowStatus(true);
        ServiceService.destroy(currentSelectedService.id)
            .then(() => {
                setTip(MigrateSubmitResult('Request accepted', currentSelectedService.id, 'success'));
                waitingServiceDestroy(currentSelectedService.id, destroyTimeout, new Date());
            })
            .catch((error: Error) => {
                console.log('waitingServiceDestroy error', error);
                setTip(MigrateSubmitFailed(error));
                setIsMigrating(false);
                setIsPreviousDisabled(true);
                setIsTipShowStatus(true);
                TipClear();
            });
    };

    const waitingServiceDestroy = (uuid: string, timeout: number, date: Date) => {
        setTip(
            MigrateSubmitResult(
                'Destroying, Please wait... [' +
                    Math.ceil((new Date().getTime() - date.getTime()) / 1000).toString() +
                    's]',
                uuid,
                'success'
            )
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ServiceService.getDeployedServiceDetailsById(uuid, getUserName(idTokenPayload as object)!)
            .then((response) => {
                if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Destroy as OperationType),
                            uuid,
                            'success'
                        )
                    );
                    setIsMigrating(true);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Finished);
                    getMigrateModalOpenStatus(false);
                    return () => {
                        clearTimeout(retryDestroyTimer);
                    };
                } else if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Destroy as OperationType),
                            uuid,
                            'error'
                        )
                    );
                    setIsMigrating(false);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Failed);
                    return () => {
                        clearTimeout(retryDestroyTimer);
                    };
                } else {
                    retryDestroyTimer = window.setTimeout(() => {
                        waitingServiceDestroy(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                }
            })
            .catch((error: Error) => {
                console.log('waitingServiceDestroy error', error);
                if (timeout > 0) {
                    retryDestroyTimer = window.setTimeout(() => {
                        waitingServiceDestroy(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                } else {
                    setTip(MigrateSubmitFailed(error));
                    setIsMigrating(false);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus(MigrationStatus.Failed);
                    TipClear();
                }
            });
    };

    return (
        <>
            <div
                className={
                    isTipShowStatus ? 'migrate-step-title-inner-class-show-tip' : 'migrate-step-title-inner-class'
                }
            >
                {tip}
            </div>
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
                                disabled={isMigrating}
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
