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
    stepItem,
}: {
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const importDataContentDescription: string = 'The data import function is not yet implemented.';

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentPortingStep(ServicePortingSteps.PrepareDeploymentParameters);
    };

    const next = () => {
        stepItem.status = 'finish';
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
