/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space } from 'antd';
import { MigrationSteps } from '../formElements/CommonTypes';
import React, { useEffect, useState } from 'react';

export const ExportServiceData = ({
    getCurrentMigrationStep,
}: {
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
}): JSX.Element => {
    const exportDataContentDescription: string = 'The export function is not yet implemented.';
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(MigrationSteps.ExportServiceData);

    const next = () => {
        setCurrentMigrationStep(MigrationSteps.SelectADestination);
    };

    useEffect(() => {
        getCurrentMigrationStep(currentMigrationStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStep]);

    return (
        <>
            <div className={'migrate-export-import-data-class'}>{exportDataContentDescription}</div>
            <div className={'migrate-step-button-inner-class'}>
                <Space size={'large'}>
                    {currentMigrationStep < MigrationSteps.DestroyTheOldService ? (
                        <Button type='primary' className={'migrate-steps-operation-button-clas'} onClick={() => next()}>
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
