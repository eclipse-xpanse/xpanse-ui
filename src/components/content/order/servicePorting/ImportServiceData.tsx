/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space, StepProps } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';

export const ImportServiceData = ({
    setCurrentPortingStep,
    updateCurrentStepStatus,
}: {
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    updateCurrentStepStatus: (currentStep: ServicePortingSteps, stepState: StepProps['status']) => void;
}): React.JSX.Element => {
    const importDataContentDescription: string = 'The data import function is not yet implemented.';

    const prev = () => {
        updateCurrentStepStatus(ServicePortingSteps.ImportServiceData, 'wait');
        setCurrentPortingStep(ServicePortingSteps.PrepareDeploymentParameters);
    };

    const next = () => {
        updateCurrentStepStatus(ServicePortingSteps.ImportServiceData, 'finish');
        setCurrentPortingStep(ServicePortingSteps.PortService);
    };

    return (
        <>
            <div className={serviceOrderStyles.portingExportImportDataClass}>{importDataContentDescription}</div>
            <div className={serviceOrderStyles.portingStepButtonInnerClass}>
                <Space size={'large'}>
                    <Button
                        type='primary'
                        onClick={() => {
                            prev();
                        }}
                    >
                        Previous
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => {
                            next();
                        }}
                    >
                        Next
                    </Button>
                </Space>
            </div>
        </>
    );
};
