/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { StepProps, Steps } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useState } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    BillingMode,
    Csp,
    DeployRequest,
    DeployedServiceDetails,
    GetOrderableServicesData,
    Options,
    Region,
    ServiceHostingType,
    VendorHostedDeployedServiceDetails,
    getOrderableServices,
} from '../../../../xpanse-api/generated';
import useGetServicePricesQuery from '../common/useGetServicePricesQuery';
import { getServiceFlavorList } from '../formDataHelpers/flavorHelper';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';
import { DeploymentForm } from './DeploymentForm';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { PortServiceSubmit } from './PortServiceSubmit.tsx';
import { SelectDestination } from './SelectDestination';
import { SelectPortingTarget } from './SelectPortingTarget.tsx';

export const ServicePorting = ({
    currentSelectedService,
    closeModal,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    closeModal: () => void;
}): React.JSX.Element => {
    const [currentPortingStep, setCurrentPortingStep] = useState<ServicePortingSteps>(
        ServicePortingSteps.ExportServiceData
    );

    const [target, setTarget] = useState<string | undefined>(undefined);

    const [cspList, setCspList] = useState<Csp[]>([]);
    const [selectCsp, setSelectCsp] = useState<Csp>(currentSelectedService.csp);

    const [serviceHostTypes, setServiceHostTypes] = useState<ServiceHostingType[]>([]);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<ServiceHostingType>(
        currentSelectedService.serviceHostingType
    );

    const [areaList, setAreaList] = useState<Tab[]>([]);
    const [selectArea, setSelectArea] = useState<string>(currentSelectedService.region.area);

    const [regionList, setRegionList] = useState<RegionDropDownInfo[]>([]);
    const [selectRegion, setSelectRegion] = useState<Region>(currentSelectedService.region);

    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        currentSelectedService.availabilityZones ?? {}
    );
    const [selectFlavor, setSelectFlavor] = useState<string>(currentSelectedService.flavor);

    const [billingModes, setBillingModes] = useState<BillingMode[] | undefined>(undefined);
    const [selectBillingMode, setSelectBillingMode] = useState<BillingMode>(currentSelectedService.billingMode);

    const deployRequest: DeployRequest = {
        category: currentSelectedService.category,
        serviceName: currentSelectedService.name,
        version: currentSelectedService.version,
        serviceHostingType: currentSelectedService.serviceHostingType,
        csp: currentSelectedService.csp,
        customerServiceName: currentSelectedService.customerServiceName,
        region: currentSelectedService.region,
        availabilityZones: currentSelectedService.availabilityZones,
        flavor: currentSelectedService.flavor,
        billingMode: currentSelectedService.billingMode,
        serviceRequestProperties: currentSelectedService.inputProperties,
    };

    const [deployParams, setDeployParams] = useState<DeployRequest>(deployRequest);

    const getOrderableServicesQuery = useQuery({
        queryKey: [
            'getOrderableServices',
            currentSelectedService.category,
            currentSelectedService.name,
            currentSelectedService.version,
        ],
        queryFn: async () => {
            const request: Options<GetOrderableServicesData> = {
                query: {
                    categoryName: currentSelectedService.category,
                    cspName: undefined,
                    serviceName: currentSelectedService.name,
                    serviceVersion: currentSelectedService.version,
                    serviceHostingType: undefined,
                },
            };
            const response = await getOrderableServices(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);

        updateSelectedParameters(
            selectCsp,
            selectArea,
            selectRegion,
            selectAvailabilityZones,
            newFlavor,
            selectServiceHostingType
        );
    };

    const updateSelectedParameters = (
        selectedCsp: Csp,
        selectAreaName: string,
        selectRegion: Region,
        selectAvailabilityZonesName: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: ServiceHostingType
    ) => {
        setSelectCsp(selectedCsp);
        setSelectRegion(selectRegion);
        setSelectAvailabilityZones(selectAvailabilityZonesName);
        setSelectFlavor(selectedFlavor);
        setSelectServiceHostingType(selectedServiceHostingType);
        setSelectArea(selectAreaName);
    };

    const getServicePriceQuery = useGetServicePricesQuery(
        currentSelectedService.serviceTemplateId,
        selectRegion.name,
        selectRegion.site,
        selectBillingMode,
        getServiceFlavorList(selectCsp, selectServiceHostingType, getOrderableServicesQuery.data ?? [])
    );

    const steps = [
        {
            title: 'Export data',
            description: 'Export service data.',
        },
        {
            title: 'Select a porting target',
            description:
                'Select between porting between different regions within the same cloud or porting between different clouds',
        },
        {
            title: 'Select a destination',
            description: 'Select a destination for porting the existing deployment.',
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
            title: 'Port Service',
            description: 'Port service to the new destination.',
        },
    ];

    const items: StepProps[] = (() =>
        steps.map((item) => ({
            key: item.title,
            title: item.title,
            description: item.description,
            status: 'wait',
        })))();

    function updateCurrentStepStatus(currentStepName: ServicePortingSteps, status: StepProps['status']): void {
        items[currentStepName].status = status;
    }

    function renderStepContent(migrationStep: ServicePortingSteps): React.JSX.Element {
        switch (migrationStep) {
            case ServicePortingSteps.ExportServiceData:
                return (
                    <ExportServiceData
                        isQueryLoading={getOrderableServicesQuery.isLoading}
                        setCurrentMigrationStep={setCurrentPortingStep}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                    />
                );
            case ServicePortingSteps.SelectPortingTarget:
                return (
                    <SelectPortingTarget
                        target={target}
                        setTarget={setTarget}
                        currentSelectedService={currentSelectedService}
                        userOrderableServiceVoList={getOrderableServicesQuery.data ?? []}
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
                        setCurrentPortingStep={setCurrentPortingStep}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                    />
                );
            case ServicePortingSteps.SelectADestination:
                return (
                    <SelectDestination
                        userOrderableServiceVoList={getOrderableServicesQuery.data ?? []}
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
                        setCurrentPortingStep={setCurrentPortingStep}
                        onChangeFlavor={onChangeFlavor}
                        getServicePriceQuery={getServicePriceQuery}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                    />
                );
            case ServicePortingSteps.ImportServiceData:
                return (
                    <ImportServiceData
                        setCurrentPortingStep={setCurrentPortingStep}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                    />
                );
            case ServicePortingSteps.PrepareDeploymentParameters:
                return (
                    <DeploymentForm
                        userOrderableServiceVoList={getOrderableServicesQuery.data ?? []}
                        selectCsp={selectCsp}
                        selectServiceHostingType={selectServiceHostingType}
                        region={selectRegion}
                        availabilityZones={selectAvailabilityZones}
                        selectFlavor={selectFlavor}
                        selectBillingMode={selectBillingMode}
                        setCurrentPortingStep={setCurrentPortingStep}
                        setDeployParameters={setDeployParams}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                    />
                );
            case ServicePortingSteps.PortService:
                return (
                    <PortServiceSubmit
                        userOrderableServiceVoList={getOrderableServicesQuery.data ?? []}
                        selectCsp={selectCsp}
                        region={selectRegion}
                        availabilityZones={selectAvailabilityZones}
                        selectFlavor={selectFlavor}
                        selectServiceHostingType={selectServiceHostingType}
                        selectBillingMode={selectBillingMode}
                        setCurrentPortingStep={setCurrentPortingStep}
                        deployParams={deployParams}
                        currentSelectedService={currentSelectedService}
                        stepItem={items[ServicePortingSteps.PortService]}
                        updateCurrentStepStatus={updateCurrentStepStatus}
                        getServicePriceQuery={getServicePriceQuery}
                        closeModal={closeModal}
                    />
                );
        }
    }

    return (
        <div className={serviceOrderStyles.portingSelectDestinationClass}>
            <Steps current={currentPortingStep} items={items} />
            {renderStepContent(currentPortingStep)}
        </div>
    );
};
