/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useMemo, useState } from 'react';
import {
    DeployedServiceDetails,
    DeployRequest,
    Region,
    ServiceCatalogService,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { SelectDestination } from './SelectDestination';
import { DeploymentForm } from './DeploymentForm';
import { StepProps, Steps } from 'antd';
import { MigrateServiceSubmit } from './MigrateServiceSubmit';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { useQuery } from '@tanstack/react-query';
import { MigrationSteps } from '../types/MigrationSteps';

export const Migrate = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp>(currentSelectedService.csp);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<UserOrderableServiceVo.serviceHostingType>(
        currentSelectedService.serviceHostingType
    );
    const [selectRegion, setSelectRegion] = useState<Region>(currentSelectedService.deployRequest.region);
    const [selectFlavor, setSelectFlavor] = useState<string>(currentSelectedService.deployRequest.flavor);
    const [deployParams, setDeployParams] = useState<DeployRequest>(currentSelectedService.deployRequest);

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

    const updateSelectedParameters = (
        selectedCsp: UserOrderableServiceVo.csp,
        selectAreaName: string,
        selectRegionName: string,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
    ) => {
        setSelectCsp(selectedCsp);
        setSelectRegion({
            name: selectRegionName,
            area: selectAreaName,
        });
        setSelectFlavor(selectedFlavor);
        setSelectServiceHostingType(selectedServiceHostingType);
    };

    const steps = useMemo(() => {
        return [
            {
                title: 'Export data',
                description: 'Export service data.',
            },
            {
                title: 'Select a destination',
                description: 'Select a destination for migrating the existing deployment.',
            },
            {
                title: 'Prepare deployment parameters',
                description: 'Prepare deployment parameters.',
            },
            {
                title: 'Import Data',
                description: 'Import service data.',
            },
            {
                title: 'Migrate',
                description: 'Migrate service to the new destination.',
            },
        ];
    }, []);

    const items: StepProps[] = useMemo(
        () =>
            steps.map((item) => ({
                key: item.title,
                title: item.title,
                description: item.description,
                status: 'wait',
            })),
        [steps]
    );

    function renderStepContent(migrationStep: MigrationSteps): React.JSX.Element {
        switch (migrationStep) {
            case MigrationSteps.ExportServiceData:
                return (
                    <ExportServiceData
                        isQueryLoading={listOrderableServices.isLoading}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.ExportServiceData]}
                    />
                );
            case MigrationSteps.SelectADestination:
                return (
                    <SelectDestination
                        userOrderableServiceVoList={listOrderableServices.data ?? []}
                        updateSelectedParameters={updateSelectedParameters}
                        currentCsp={selectCsp}
                        currentRegion={selectRegion.name}
                        currentFlavor={selectFlavor}
                        currentServiceHostingType={selectServiceHostingType}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.SelectADestination]}
                    />
                );
            case MigrationSteps.ImportServiceData:
                return (
                    <ImportServiceData
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.ImportServiceData]}
                    />
                );
            case MigrationSteps.PrepareDeploymentParameters:
                return (
                    <DeploymentForm
                        userOrderableServiceVoList={listOrderableServices.data ?? []}
                        selectCsp={selectCsp}
                        selectServiceHostingType={selectServiceHostingType}
                        region={selectRegion}
                        selectFlavor={selectFlavor}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        setDeployParameters={setDeployParams}
                        stepItem={items[MigrationSteps.PrepareDeploymentParameters]}
                    />
                );
            case MigrationSteps.MigrateService:
                return (
                    <MigrateServiceSubmit
                        userOrderableServiceVoList={listOrderableServices.data ?? []}
                        selectCsp={selectCsp}
                        region={selectRegion}
                        selectFlavor={selectFlavor}
                        selectServiceHostingType={selectServiceHostingType}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        deployParams={deployParams}
                        currentSelectedService={currentSelectedService}
                        stepItem={items[MigrationSteps.MigrateService]}
                    />
                );
        }
    }

    return (
        <div className={'migrate-select-destination-class'}>
            <Steps current={currentMigrationStep} items={items} />
            {renderStepContent(currentMigrationStep)}
        </div>
    );
};
