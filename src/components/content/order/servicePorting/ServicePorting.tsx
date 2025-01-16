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
    GetOrderableServicesData,
    Region,
    VendorHostedDeployedServiceDetails,
    billingMode,
    csp,
    getOrderableServices,
    serviceHostingType,
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
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [currentPortingStep, setCurrentPortingStep] = useState<ServicePortingSteps>(
        ServicePortingSteps.ExportServiceData
    );

    const [target, setTarget] = useState<string | undefined>(undefined);

    const [cspList, setCspList] = useState<csp[]>([]);
    const [selectCsp, setSelectCsp] = useState<csp>(currentSelectedService.csp as csp);

    const [serviceHostTypes, setServiceHostTypes] = useState<serviceHostingType[]>([]);
    const [selectServiceHostingType, setSelectServiceHostingType] = useState<serviceHostingType>(
        currentSelectedService.serviceHostingType as serviceHostingType
    );

    const [areaList, setAreaList] = useState<Tab[]>([]);
    const [selectArea, setSelectArea] = useState<string>(currentSelectedService.deployRequest.region.area);

    const [regionList, setRegionList] = useState<RegionDropDownInfo[]>([]);
    const [selectRegion, setSelectRegion] = useState<Region>(currentSelectedService.deployRequest.region);

    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        currentSelectedService.deployRequest.availabilityZones ?? {}
    );
    const [selectFlavor, setSelectFlavor] = useState<string>(currentSelectedService.deployRequest.flavor);

    const [billingModes, setBillingModes] = useState<billingMode[] | undefined>(undefined);
    const [selectBillingMode, setSelectBillingMode] = useState<billingMode>(
        currentSelectedService.deployRequest.billingMode.toString() as billingMode
    );

    const [deployParams, setDeployParams] = useState<DeployRequest>(currentSelectedService.deployRequest);

    const getOrderableServicesQuery = useQuery({
        queryKey: [
            'getOrderableServices',
            currentSelectedService.category,
            currentSelectedService.name,
            currentSelectedService.version,
        ],
        queryFn: () => {
            const data: GetOrderableServicesData = {
                categoryName: currentSelectedService.category,
                cspName: undefined,
                serviceName: currentSelectedService.name,
                serviceVersion: currentSelectedService.version,
                serviceHostingType: undefined,
            };
            return getOrderableServices(data);
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
        selectedCsp: csp,
        selectAreaName: string,
        selectRegion: Region,
        selectAvailabilityZonesName: Record<string, string>,
        selectedFlavor: string,
        selectedServiceHostingType: serviceHostingType
    ) => {
        setSelectCsp(selectedCsp);
        setSelectRegion(selectRegion);
        setSelectAvailabilityZones(selectAvailabilityZonesName);
        setSelectFlavor(selectedFlavor);
        setSelectServiceHostingType(selectedServiceHostingType);
        setSelectArea(selectAreaName);
    };

    const getServicePriceQuery = useGetServicePricesQuery(
        currentSelectedService.serviceTemplateId ?? '',
        selectRegion.name,
        selectRegion.site,
        selectBillingMode,
        getServiceFlavorList(selectCsp, selectServiceHostingType, getOrderableServicesQuery.data ?? [])
    );

    const steps = useMemo(() => {
        return [
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

    function renderStepContent(migrationStep: ServicePortingSteps): React.JSX.Element {
        switch (migrationStep) {
            case ServicePortingSteps.ExportServiceData:
                return (
                    <ExportServiceData
                        isQueryLoading={getOrderableServicesQuery.isLoading}
                        setCurrentMigrationStep={setCurrentPortingStep}
                        stepItem={items[ServicePortingSteps.ExportServiceData]}
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
                        stepItem={items[ServicePortingSteps.SelectPortingTarget]}
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
                        stepItem={items[ServicePortingSteps.SelectADestination]}
                        onChangeFlavor={onChangeFlavor}
                        getServicePriceQuery={getServicePriceQuery}
                    />
                );
            case ServicePortingSteps.ImportServiceData:
                return (
                    <ImportServiceData
                        setCurrentPortingStep={setCurrentPortingStep}
                        stepItem={items[ServicePortingSteps.ImportServiceData]}
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
                        stepItem={items[ServicePortingSteps.PrepareDeploymentParameters]}
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
                        getServicePriceQuery={getServicePriceQuery}
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
