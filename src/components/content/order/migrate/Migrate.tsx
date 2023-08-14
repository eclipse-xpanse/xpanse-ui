/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { ServiceCatalogService, ServiceVo, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { SelectDestination } from './SelectDestination';
import { ShowDeploy } from './ShowDeploy';
import { Steps } from 'antd';
import { MigrateService } from './MigrateService';
import { MigrationStatus, MigrationSteps } from '../formElements/CommonTypes';
import { ExportServiceData } from './ExportServiceData';
import { ImportServiceData } from './ImportServiceData';
import { useQuery } from '@tanstack/react-query';

export const Migrate = ({
    currentSelectedService,
    getMigrateModalOpenStatus,
}: {
    currentSelectedService: ServiceVo | undefined;
    getMigrateModalOpenStatus: (isMigrateModalOpen: boolean) => void;
}): JSX.Element => {
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);
    const [currentMigrationStepStatus, setCurrentMigrationStepStatus] = useState<MigrationStatus | undefined>(
        undefined
    );
    const [userAvailableServiceVoList, setUserAvailableServiceVoList] = useState<UserAvailableServiceVo[]>([]);

    const [selectCsp, setSelectCsp] = useState<string>('');
    const [selectArea, setSelectArea] = useState<string>('');
    const [selectRegion, setSelectRegion] = useState<string>('');
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [deployParams, setDeployParams] = useState<Record<string, never> | undefined>(undefined);

    const listAvailableServices = useQuery({
        queryKey: [
            'listAvailableServices',
            currentSelectedService?.category,
            currentSelectedService?.csp,
            currentSelectedService?.name,
            currentSelectedService?.version,
        ],
        queryFn: () =>
            ServiceCatalogService.listAvailableServices(
                currentSelectedService?.category,
                currentSelectedService?.csp,
                currentSelectedService?.name,
                currentSelectedService?.version
            ),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCurrentMigrationStepStatus(MigrationStatus.Processing);
        setCurrentMigrationStep(MigrationSteps.ExportServiceData);
        if (currentSelectedService === undefined) {
            return;
        }
        if (listAvailableServices.data && listAvailableServices.data.length > 0) {
            setUserAvailableServiceVoList(listAvailableServices.data);
        } else {
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAvailableServices.data, listAvailableServices.isSuccess]);

    useEffect(() => {
        if (listAvailableServices.isError) {
            setCurrentMigrationStepStatus(MigrationStatus.Processing);
            setCurrentMigrationStep(MigrationSteps.ExportServiceData);
            setUserAvailableServiceVoList([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAvailableServices.isError, listAvailableServices.error]);

    const getSelectedParameters = (
        selectedCsp: string,
        selectedArea: string,
        selectedRegion: string,
        selectedFlavor: string
    ) => {
        setSelectCsp(selectedCsp);
        setSelectArea(selectedArea);
        setSelectRegion(selectedRegion);
        setSelectFlavor(selectedFlavor);
    };

    const getDeployParameters = (values: Record<string, never>) => {
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
            content: <ExportServiceData getCurrentMigrationStep={getCurrentMigrationStep} />,
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
                    getCurrentMigrationStep={getCurrentMigrationStep}
                />
            ),
            description: 'Select a destination for migrating the existing deployment.',
        },
        {
            title: 'Prepare deployment parameters',
            content: (
                <ShowDeploy
                    userAvailableServiceVoList={userAvailableServiceVoList}
                    selectCsp={selectCsp}
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                    getCurrentMigrationStep={getCurrentMigrationStep}
                    getDeployParameters={getDeployParameters}
                    currentDeployParams={deployParams}
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
                <MigrateService
                    userAvailableServiceVoList={userAvailableServiceVoList}
                    selectCsp={selectCsp}
                    selectArea={selectArea}
                    selectRegion={selectRegion}
                    selectFlavor={selectFlavor}
                    getCurrentMigrationStep={getCurrentMigrationStep}
                    deployParams={deployParams}
                    getMigrateModalOpenStatus={getMigrateModalOpenStatus}
                    currentSelectedService={currentSelectedService}
                    getCurrentMigrationStepStatus={getCurrentMigrationStepStatus}
                />
            ),
            description: 'Migrate service to the create destination.',
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
