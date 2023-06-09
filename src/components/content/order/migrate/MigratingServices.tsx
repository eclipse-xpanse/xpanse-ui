/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import {
    CloudServiceProvider,
    CreateRequest,
    ServiceDetailVo,
    ServicesAvailableService,
    ServiceService,
    ServiceVo,
    UserAvailableServiceVo,
} from '../../../../xpanse-api/generated';
import { SelectDestination } from './SelectDestination';
import { ShowDeploy } from './ShowDeploy';
import { Button, FormInstance, Popconfirm, Space, Steps } from 'antd';
import { DestroyService } from './DestroyService';
import { OrderSubmitProps } from '../OrderSubmit';
import {
    deployTimeout,
    destroyTimeout,
    migrationStepsInterval,
    usernameKey,
    waitServicePeriod,
} from '../../../utils/constants';
import { getCreateRequest, getDeployParams, MigrationSteps, OperationType } from '../formElements/CommonTypes';
import { ProcessingStatus } from '../ProcessingStatus';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { MigrateSubmitResult } from '../OrderSubmitResult';
import { MigrateSubmitFailed } from '../OrderSubmitFailed';

export const MigratingServices = ({
    currentSelectedService,
    getMigrateModalCloseStatus,
    getMigrateModalOpenStatus,
}: {
    currentSelectedService: ServiceVo | undefined;
    getMigrateModalCloseStatus: (isMigrateModalClosable: boolean) => void;
    getMigrateModalOpenStatus: (isMigrateModalOpen: boolean) => void;
}): JSX.Element => {
    const formRef = React.createRef<FormInstance<Record<string, never>>>();
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);
    const [currentMigrationStepStatus, setCurrentMigrationStepStatus] = useState<
        'wait' | 'process' | 'finish' | 'error' | undefined
    >(undefined);
    const [userAvailableServiceVoList, setUserAvailableServiceVoList] = useState<UserAvailableServiceVo[]>([]);

    const [selectCsp, setSelectCsp] = useState<CloudServiceProvider.name | undefined>(undefined);
    const [selectArea, setSelectArea] = useState<string>('');
    const [selectRegion, setSelectRegion] = useState<string>('');
    const [selectFlavor, setSelectFlavor] = useState<string>('');

    const [tip, setTip] = useState<JSX.Element | undefined>(undefined);

    let retryDeployTimer: number | undefined = undefined;
    let retryDestroyTimer: number | undefined = undefined;
    const [isDeploying, setIsDeploying] = useState<boolean>(false);
    const [isDestroying, setIsDestroying] = useState<boolean>(false);
    const [isTipShowStatus, setIsTipShowStatus] = useState<boolean>(false);
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(false);

    useEffect(() => {
        TipClear();
        setIsDeploying(false);
        setIsDestroying(false);
        setIsNextDisabled(false);
        setIsTipShowStatus(false);
        setIsPreviousDisabled(false);
        setCurrentMigrationStepStatus('process');
        getMigrateModalCloseStatus(true);
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
        if (currentSelectedService === undefined) {
            return;
        }
        const categoryName = currentSelectedService.category;
        const serviceName = currentSelectedService.name;
        const serviceVersion = currentSelectedService.version;
        void ServicesAvailableService.listAvailableServices(categoryName, '', serviceName, serviceVersion).then(
            (rsp: UserAvailableServiceVo[]) => {
                if (rsp.length > 0) {
                    setUserAvailableServiceVoList(rsp);
                } else {
                    return;
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSelectedService]);

    const getSelectedParameters = (
        selectedCsp: CloudServiceProvider.name,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string
    ) => {
        setSelectCsp(selectedCsp);
        setSelectArea(selectedArea);
        setSelectRegion(selectedRegion);
        setSelectFlavor(selectedFlavor);
    };

    const next = () => {
        TipClear();
        setIsTipShowStatus(false);
        setCurrentMigrationStepStatus('process');
        if (
            currentMigrationStep + migrationStepsInterval ===
            MigrationSteps.DeployServiceOnTheNewDestination.valueOf()
        ) {
            setIsNextDisabled(true);
        }
        setCurrentMigrationStep(currentMigrationStep + migrationStepsInterval);
    };

    const prev = () => {
        TipClear();
        setIsTipShowStatus(false);
        setCurrentMigrationStepStatus('process');
        if (
            currentMigrationStep - migrationStepsInterval === MigrationSteps.SelectADestination.valueOf() ||
            currentMigrationStep - migrationStepsInterval === MigrationSteps.ExportServiceData.valueOf()
        ) {
            setIsNextDisabled(false);
        }
        setCurrentMigrationStep(currentMigrationStep - migrationStepsInterval);
    };

    const deploy = () => {
        TipClear();
        setIsTipShowStatus(false);
        setCurrentMigrationStepStatus('process');
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    function TipClear() {
        setTip(undefined);
    }

    const handleFinish = (values: Record<string, never>) => {
        let customerServiceName = '';
        Object.keys(values).forEach((key) => {
            if (key === 'Name') {
                customerServiceName = values[key];
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
        setIsDeploying(true);
        setIsNextDisabled(true);
        setIsPreviousDisabled(true);
        setIsTipShowStatus(true);
        getMigrateModalCloseStatus(false);
        ServiceService.deploy(createRequest)
            .then((uuid) => {
                setTip(MigrateSubmitResult('Request accepted', uuid, 'success'));
                waitingServiceReady(uuid, deployTimeout, new Date());
            })
            .catch((error: Error) => {
                console.error(error);
                setIsDeploying(false);
                setIsNextDisabled(true);
                setIsPreviousDisabled(false);
                setIsTipShowStatus(true);
                setTip(MigrateSubmitFailed(error));
                setCurrentMigrationStepStatus('error');
                TipClear();
            });
    };

    function waitingServiceReady(uuid: string, timeout: number, date: Date) {
        setTip(
            MigrateSubmitResult(
                'Deploying, Please wait... [' +
                    Math.ceil((new Date().getTime() - date.getTime()) / 1000).toString() +
                    's]',
                uuid,
                'success'
            )
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ServiceService.getDeployedServiceDetailsById(uuid, localStorage.getItem(usernameKey)!)
            .then((response) => {
                if (response.serviceState === ServiceDetailVo.serviceState.DEPLOY_SUCCESS) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Deploy as OperationType),
                            uuid,
                            'success'
                        )
                    );
                    setIsDeploying(true);
                    setIsNextDisabled(false);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('finish');
                    getMigrateModalCloseStatus(true);
                    TipClear();
                    setCurrentMigrationStep(currentMigrationStep + migrationStepsInterval);
                    return () => {
                        clearTimeout(retryDeployTimer);
                    };
                } else if (response.serviceState === ServiceDetailVo.serviceState.DEPLOY_FAILED) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Deploy as OperationType),
                            uuid,
                            'error'
                        )
                    );
                    setIsDeploying(false);
                    setIsNextDisabled(true);
                    setIsPreviousDisabled(false);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('error');
                    getMigrateModalCloseStatus(true);
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
                    setIsDeploying(false);
                    setIsNextDisabled(true);
                    setIsPreviousDisabled(false);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('error');
                    getMigrateModalCloseStatus(true);
                    TipClear();
                }
            });
    }

    const destroy = () => {
        setCurrentMigrationStepStatus('process');
        if (currentSelectedService === undefined) {
            return;
        }
        setIsDestroying(true);
        setIsPreviousDisabled(true);
        setIsTipShowStatus(true);
        getMigrateModalCloseStatus(false);
        ServiceService.destroy(currentSelectedService.id)
            .then(() => {
                setTip(MigrateSubmitResult('Request accepted', currentSelectedService.id, 'success'));
                waitingServiceDestroy(currentSelectedService.id, destroyTimeout, new Date());
            })
            .catch((error: Error) => {
                console.log('waitingServiceDestroy error', error);
                setTip(MigrateSubmitFailed(error));
                setIsDestroying(false);
                setIsPreviousDisabled(true);
                setIsTipShowStatus(true);
                getMigrateModalCloseStatus(true);
                TipClear();
            });
    };

    function waitingServiceDestroy(uuid: string, timeout: number, date: Date) {
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
        ServiceService.getDeployedServiceDetailsById(uuid, localStorage.getItem(usernameKey)!)
            .then((response) => {
                if (response.serviceState === ServiceDetailVo.serviceState.DESTROY_SUCCESS) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Destroy as OperationType),
                            uuid,
                            'success'
                        )
                    );
                    setIsDestroying(true);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('finish');
                    getMigrateModalCloseStatus(false);
                    getMigrateModalOpenStatus(false);
                    return () => {
                        clearTimeout(retryDestroyTimer);
                    };
                } else if (response.serviceState === ServiceDetailVo.serviceState.DESTROY_FAILED) {
                    setTip(
                        MigrateSubmitResult(
                            ProcessingStatus(response, OperationType.Destroy as OperationType),
                            uuid,
                            'error'
                        )
                    );
                    setIsDestroying(false);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('error');
                    getMigrateModalCloseStatus(true);
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
                    setIsDestroying(false);
                    setIsPreviousDisabled(true);
                    setIsTipShowStatus(true);
                    setCurrentMigrationStepStatus('error');
                    getMigrateModalCloseStatus(true);
                    TipClear();
                }
            });
    }

    const steps = [
        {
            title: 'Export data',
            content: <ExportServiceData />,
            description: 'Export service data.',
        },
        {
            title: 'Select a destination',
            content: (
                <SelectDestination
                    userAvailableServiceVoList={userAvailableServiceVoList}
                    getSelectedParameters={getSelectedParameters}
                    currentCsp={selectCsp}
                    currentArea={selectArea}
                    currentRegion={selectRegion}
                    currentFlavor={selectFlavor}
                />
            ),
            description: 'Select a destination for migrating the existing deployment.',
        },
        {
            title: 'Deploy',
            content: (
                <ShowDeploy
                    userAvailableServiceVoList={userAvailableServiceVoList}
                    selectCsp={selectCsp}
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                    onFinish={handleFinish}
                    deploying={isDeploying}
                    formRef={formRef}
                />
            ),
            description: 'Deploy the service on the new destination.',
        },
        {
            title: 'Import Data',
            content: <ImportServiceData />,
            description: 'Import service data.',
        },
        {
            title: 'Destroy',
            content: (
                <DestroyService
                    userAvailableServiceVoList={userAvailableServiceVoList}
                    selectCsp={selectCsp}
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                />
            ),
            description: 'Destroy the old deployment.',
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

    return (
        <div className={'migrate-select-destination-class'}>
            <div
                className={
                    isTipShowStatus ? 'migrate-step-title-inner-class-show-tip' : 'migrate-step-title-inner-class'
                }
            >
                {tip}
                <Steps current={currentMigrationStep} items={items} status={currentMigrationStepStatus} />
            </div>
            <div
                className={
                    isTipShowStatus ? 'migrate-step-content-inner-class-show-tip' : 'migrate-step-content-inner-class'
                }
            >
                {steps[currentMigrationStep].content}
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

                    {currentMigrationStep < MigrationSteps.DestroyTheOldService ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => next()}
                            disabled={isNextDisabled}
                        >
                            Next
                        </Button>
                    ) : (
                        <></>
                    )}

                    {currentMigrationStep === MigrationSteps.DeployServiceOnTheNewDestination ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            htmlType='submit'
                            onClick={deploy}
                            disabled={isDeploying}
                        >
                            Deploy
                        </Button>
                    ) : (
                        <></>
                    )}

                    {currentMigrationStep === MigrationSteps.DestroyTheOldService ? (
                        <Popconfirm
                            title='Destroy the old service'
                            description='Are you sure to destroy the old service?'
                            okText='Yes'
                            cancelText='No'
                            onConfirm={destroy}
                        >
                            <Button
                                type='primary'
                                className={'migrate-steps-operation-button-clas'}
                                disabled={isDestroying}
                            >
                                Destroy
                            </Button>
                        </Popconfirm>
                    ) : (
                        <></>
                    )}
                </Space>
            </div>
        </div>
    );
};
