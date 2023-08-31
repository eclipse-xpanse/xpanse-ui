/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space } from 'antd';
import { MigrationSteps } from '../formElements/CommonTypes';
import React, { useEffect, useState } from 'react';

export const ImportServiceData = ({
    getCurrentMigrationStep,
}: {
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
}): JSX.Element => {
    const importDataContentDescription: string = 'The data import function is not yet implemented.';
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ImportServiceData);

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.DeployServiceOnTheNewDestination);
    };

    const next = () => {
        setCurrentMigrationStep(MigrationSteps.DestroyTheOldService);
    };
    useEffect(() => {
        getCurrentMigrationStep(currentMigrationStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStep]);

    return (
        <>
            <div className={'migrate-export-import-data-class'}>{importDataContentDescription}</div>
            <div className={'migrate-step-button-inner-class'}>
                <Space size={'large'}>
                    {currentMigrationStep > MigrationSteps.ExportServiceData ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                prev();
                            }}
                        >
                            Previous
                        </Button>
                    ) : (
                        <></>
                    )}

                    {currentMigrationStep < MigrationSteps.DestroyTheOldService ? (
                        <Button
                            type='primary'
                            className={'migrate-steps-operation-button-clas'}
                            onClick={() => {
                                next();
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <></>
                    )}
                </Space>
            </div>
        </>
    );
};
