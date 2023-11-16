/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import {
    DeployRequest,
    ServiceCatalogService,
    ServiceVo,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { SelectDestination } from './SelectDestination';
import { DeploymentForm } from './DeploymentForm';
import { Steps } from 'antd';
import { MigrateServiceSubmit } from './MigrateServiceSubmit';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { useQuery } from '@tanstack/react-query';
import { MigrationSteps } from '../types/MigrationSteps';
import { MigrationStatus } from '../types/MigrationStatus';

export const Migrate = ({ currentSelectedService }: { currentSelectedService: ServiceVo }): React.JSX.Element => {
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);
    const [currentMigrationStepStatus, setCurrentMigrationStepStatus] = useState<MigrationStatus | undefined>(
        undefined
    );
    const [userOrderableServiceVoList, setUserOrderableServiceVoList] = useState<UserOrderableServiceVo[]>([]);
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp | undefined>(undefined);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<
        UserOrderableServiceVo.serviceHostingType | undefined
    >(undefined);
    const [selectArea, setSelectArea] = useState<string>('');
    const [selectRegion, setSelectRegion] = useState<string>('');
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [deployParams, setDeployParams] = useState<DeployRequest | undefined>(undefined);

    const listOrderableServices = useQuery({
        queryKey: [
            'listOrderableServices',
            currentSelectedService.category,
            currentSelectedService.name,
            currentSelectedService.version,
        ],
        queryFn: () =>
            ServiceCatalogService.listOrderableServices(
                currentSelectedService.category,
                undefined,
                currentSelectedService.name,
                currentSelectedService.version
            ),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCurrentMigrationStepStatus(MigrationStatus.Processing);
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
        if (listOrderableServices.data && listOrderableServices.data.length > 0) {
            setUserOrderableServiceVoList(listOrderableServices.data);
        } else {
            return;
        }
    }, [listOrderableServices.data, listOrderableServices.isSuccess]);

    useEffect(() => {
        if (listOrderableServices.isError) {
            setCurrentMigrationStepStatus(MigrationStatus.Processing);
            setCurrentMigrationStep(MigrationSteps.ExportServiceData);
            setUserOrderableServiceVoList([]);
        }
    }, [listOrderableServices.isError]);

    const updateSelectedParameters = (
        selectedCsp: UserOrderableServiceVo.csp,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
    ) => {
        setSelectCsp(selectedCsp);
        setSelectArea(selectedArea);
        setSelectRegion(selectedRegion);
        setSelectFlavor(selectedFlavor);
        setSelectServiceHostingType(selectedServiceHostingType);
    };

    const getDeployParameters = (values: DeployRequest) => {
        setDeployParams(values);
    };

    const getCurrentMigrationStep = (step: MigrationSteps) => {
        setCurrentMigrationStep(step);
    };

    const getCurrentMigrationStepStatus = (migrationStepStatus: MigrationStatus | undefined) => {
        setCurrentMigrationStepStatus(migrationStepStatus);
    };

    const steps = [
        {
            title: 'Export data',
            content: (
                <ExportServiceData
                    isQueryLoading={listOrderableServices.isLoading}
                    getCurrentMigrationStep={getCurrentMigrationStep}
                />
            ),
            description: 'Export service data.',
        },
        {
            title: 'Select a destination',
            content: (
                <SelectDestination
                    userOrderableServiceVoList={userOrderableServiceVoList}
                    updateSelectedParameters={updateSelectedParameters}
                    currentCsp={selectCsp}
                    currentArea={selectArea}
                    currentRegion={selectRegion}
                    currentFlavor={selectFlavor}
                    currentServiceHostingType={selectServiceHostingType}
                    getCurrentMigrationStep={getCurrentMigrationStep}
                />
            ),
            description: 'Select a destination for migrating the existing deployment.',
        },
        {
            title: 'Prepare deployment parameters',
            content: (
                <DeploymentForm
                    userOrderableServiceVoList={userOrderableServiceVoList}
                    selectCsp={selectCsp ? selectCsp : currentSelectedService.csp}
                    selectServiceHostingType={
                        selectServiceHostingType ? selectServiceHostingType : currentSelectedService.serviceHostingType
                    }
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                    getCurrentMigrationStep={getCurrentMigrationStep}
                    getDeployParameters={getDeployParameters}
                />
            ),
            description: 'Prepare deployment parameters.',
        },
        {
            title: 'Import Data',
            content: <ImportServiceData getCurrentMigrationStep={getCurrentMigrationStep} />,
            description: 'Import service data.',
        },
        {
            title: 'Migrate',
            content: (
                <MigrateServiceSubmit
                    userOrderableServiceVoList={userOrderableServiceVoList}
                    selectCsp={selectCsp ?? currentSelectedService.csp}
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                    selectServiceHostingType={
                        selectServiceHostingType ? selectServiceHostingType : currentSelectedService.serviceHostingType
                    }
                    getCurrentMigrationStep={getCurrentMigrationStep}
                    deployParams={deployParams}
                    currentSelectedService={currentSelectedService}
                    getCurrentMigrationStepStatus={getCurrentMigrationStepStatus}
                />
            ),
            description: 'Migrate service to the new destination.',
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

    return (
        <div className={'migrate-select-destination-class'}>
            <Steps current={currentMigrationStep} items={items} status={currentMigrationStepStatus} />
            {steps[currentMigrationStep].content}
        </div>
    );
};
