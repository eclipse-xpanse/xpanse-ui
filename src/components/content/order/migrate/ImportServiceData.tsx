/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space, StepProps } from 'antd';
import React from 'react';
import { MigrationSteps } from '../types/MigrationSteps';

export const ImportServiceData = ({
    setCurrentMigrationStep,
    stepItem,
}: {
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const importDataContentDescription: string = 'The data import function is not yet implemented.';

    const prev = () => {
        stepItem.status = 'wait';
        setCurrentMigrationStep(MigrationSteps.PrepareDeploymentParameters);
    };

    const next = () => {
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.MigrateService);
    };

    return (
        <>
            <div className={'migrate-export-import-data-class'}>{importDataContentDescription}</div>
            <div className={'migrate-step-button-inner-class'}>
                <Space size={'large'}>
                    <Button
                        type='primary'
                        className={'migrate-steps-operation-button-clas'}
                        onClick={() => {
                            prev();
                        }}
                    >
                        Previous
                    </Button>
                    <Button
                        type='primary'
                        className={'migrate-steps-operation-button-clas'}
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
