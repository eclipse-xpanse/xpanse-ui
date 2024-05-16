/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useMemo, useState } from 'react';
import {
    DeployedServiceDetails,
    DeployRequest,
    MigrateRequest,
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
import { SelectMigrationTarget } from './SelectMigrationTarget';
import { useQuery } from '@tanstack/react-query';
import { MigrationSteps } from '../types/MigrationSteps';
import { Tab } from 'rc-tabs/lib/interface';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';

export const Migrate = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);

    const [target, setTarget] = useState<string | undefined>(undefined);

    const [cspList, setCspList] = useState<UserOrderableServiceVo.csp[]>([]);
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp>(currentSelectedService.csp);

    const [serviceHostTypes, setServiceHostTypes] = useState<UserOrderableServiceVo.serviceHostingType[]>([]);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<UserOrderableServiceVo.serviceHostingType>(
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

    const [billingModes, setBillingModes] = useState<MigrateRequest.billingMode[] | undefined>(undefined);
    const [selectBillingMode, setSelectBillingMode] = useState<MigrateRequest.billingMode>(
        currentSelectedService.deployRequest.billingMode.toString() as MigrateRequest.billingMode
    );

    const [isEulaAccepted, setIsEulaAccepted] = useState<boolean>(false);
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
        selectAvailabilityZonesName: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType
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
                        isQueryLoading={listOrderableServices.isLoading}
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
                        userOrderableServiceVoList={listOrderableServices.data ?? []}
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
                        userOrderableServiceVoList={listOrderableServices.data ?? []}
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
                        region={{ name: selectRegion, area: selectArea }}
                        availabilityZones={selectAvailabilityZones}
                        selectFlavor={selectFlavor}
                        isEulaAccepted={isEulaAccepted}
                        setIsEulaAccepted={setIsEulaAccepted}
                        selectBillingMode={selectBillingMode}
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
        <div className={'migrate-select-destination-class'}>
            <Steps current={currentMigrationStep} items={items} />
            {renderStepContent(currentMigrationStep)}
        </div>
    );
};
