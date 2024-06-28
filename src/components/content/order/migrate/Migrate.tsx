/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { StepProps, Steps } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useMemo, useState } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    DeployRequest,
    DeployedServiceDetails,
    ListOrderableServicesData,
    VendorHostedDeployedServiceDetails,
    billingMode,
    csp,
    listOrderableServices,
} from '../../../../xpanse-api/generated';
import { MigrationSteps } from '../types/MigrationSteps';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { DeploymentForm } from './DeploymentForm';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { MigrateServiceSubmit } from './MigrateServiceSubmit';
import { SelectDestination } from './SelectDestination';
import { SelectMigrationTarget } from './SelectMigrationTarget';

export const Migrate = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);

    const [target, setTarget] = useState<string | undefined>(undefined);

    const [cspList, setCspList] = useState<csp[]>([]);
    const [selectCsp, setSelectCsp] = useState<string>(currentSelectedService.csp);

    const [serviceHostTypes, setServiceHostTypes] = useState<string[]>([]);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<string>(
        currentSelectedService.serviceHostingType
    );

    const [areaList, setAreaList] = useState<Tab[]>([]);
    const [selectArea, setSelectArea] = useState<string>(currentSelectedService.deployRequest.region.area);

    const [regionList, setRegionList] = useState<RegionDropDownInfo[]>([]);
    const [selectRegion, setSelectRegion] = useState<string>(currentSelectedService.deployRequest.region.name);

    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        currentSelectedService.deployRequest.availabilityZones ?? {}
    );
    const [selectFlavor, setSelectFlavor] = useState<string>(currentSelectedService.deployRequest.flavor);

    const [billingModes, setBillingModes] = useState<billingMode[] | undefined>(undefined);
    const [selectBillingMode, setSelectBillingMode] = useState<billingMode>(
        currentSelectedService.deployRequest.billingMode.toString() as billingMode
    );

    const [deployParams, setDeployParams] = useState<DeployRequest>(currentSelectedService.deployRequest);

    const listOrderableServicesQuery = useQuery({
        queryKey: [
            'listOrderableServices',
            currentSelectedService.category,
            currentSelectedService.name,
            currentSelectedService.version,
        ],
        queryFn: () => {
            const data: ListOrderableServicesData = {
                categoryName: currentSelectedService.category,
                cspName: undefined,
                serviceName: currentSelectedService.name,
                serviceVersion: currentSelectedService.version,
                serviceHostingType: undefined,
            };
            return listOrderableServices(data);
        },
        refetchOnWindowFocus: false,
    });

    const updateSelectedParameters = (
        selectedCsp: string,
        selectAreaName: string,
        selectRegionName: string,
        selectAvailabilityZonesName: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: string
    ) => {
        setSelectCsp(selectedCsp);
        setSelectRegion(selectRegionName);
        setSelectAvailabilityZones(selectAvailabilityZonesName);
        setSelectFlavor(selectedFlavor);
        setSelectServiceHostingType(selectedServiceHostingType);
        setSelectArea(selectAreaName);
    };

    const steps = useMemo(() => {
        return [
            {
                title: 'Export data',
                description: 'Export service data.',
            },
            {
                title: 'Select a migrate target',
                description:
                    'Select between migrating between different regions within the same cloud or migrating between different clouds',
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
                        isQueryLoading={listOrderableServicesQuery.isLoading}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.ExportServiceData]}
                    />
                );
            case MigrationSteps.SelectMigrateTarget:
                return (
                    <SelectMigrationTarget
                        target={target}
                        setTarget={setTarget}
                        currentSelectedService={currentSelectedService}
                        userOrderableServiceVoList={listOrderableServicesQuery.data ?? []}
                        setCspList={setCspList}
                        setSelectCsp={setSelectCsp}
                        setServiceHostTypes={setServiceHostTypes}
                        setSelectServiceHostingType={setSelectServiceHostingType}
                        setAreaList={setAreaList}
                        setSelectArea={setSelectArea}
                        setRegionList={setRegionList}
                        setSelectRegion={setSelectRegion}
                        setBillingModes={setBillingModes}
                        setSelectBillingMode={setSelectBillingMode}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.SelectMigrateTarget]}
                    />
                );
            case MigrationSteps.SelectADestination:
                return (
                    <SelectDestination
                        userOrderableServiceVoList={listOrderableServicesQuery.data ?? []}
                        updateSelectedParameters={updateSelectedParameters}
                        cspList={cspList}
                        selectCsp={selectCsp}
                        setSelectCsp={setSelectCsp}
                        serviceHostTypes={serviceHostTypes}
                        selectServiceHostType={selectServiceHostingType}
                        setSelectServiceHostingType={setSelectServiceHostingType}
                        areaList={areaList}
                        selectArea={selectArea}
                        setSelectArea={setSelectArea}
                        regionList={regionList}
                        selectRegion={selectRegion}
                        setSelectRegion={setSelectRegion}
                        selectAvailabilityZones={selectAvailabilityZones}
                        setSelectAvailabilityZones={setSelectAvailabilityZones}
                        currentFlavor={selectFlavor}
                        billingModes={billingModes}
                        selectBillingMode={selectBillingMode}
                        setSelectBillingMode={setSelectBillingMode}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        stepItem={items[MigrationSteps.SelectADestination]}
                        currentSelectedService={currentSelectedService}
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
                        userOrderableServiceVoList={listOrderableServicesQuery.data ?? []}
                        selectCsp={selectCsp}
                        selectServiceHostingType={selectServiceHostingType}
                        region={{ name: selectRegion, area: selectArea }}
                        availabilityZones={selectAvailabilityZones}
                        selectFlavor={selectFlavor}
                        selectBillingMode={selectBillingMode}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        setDeployParameters={setDeployParams}
                        stepItem={items[MigrationSteps.PrepareDeploymentParameters]}
                    />
                );
            case MigrationSteps.MigrateService:
                return (
                    <MigrateServiceSubmit
                        userOrderableServiceVoList={listOrderableServicesQuery.data ?? []}
                        selectCsp={selectCsp}
                        region={{ name: selectRegion, area: selectArea }}
                        availabilityZones={selectAvailabilityZones}
                        selectFlavor={selectFlavor}
                        selectServiceHostingType={selectServiceHostingType}
                        selectBillingMode={selectBillingMode}
                        setCurrentMigrationStep={setCurrentMigrationStep}
                        deployParams={deployParams}
                        currentSelectedService={currentSelectedService}
                        stepItem={items[MigrationSteps.MigrateService]}
                    />
                );
        }
    }

    return (
        <div className={serviceOrderStyles.migrateSelectDestinationClass}>
            <Steps current={currentMigrationStep} items={items} />
            {renderStepContent(currentMigrationStep)}
        </div>
    );
};
