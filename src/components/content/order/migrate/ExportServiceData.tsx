/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space, Spin, StepProps } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { MigrationSteps } from '../types/MigrationSteps';

export const ExportServiceData = ({
    isQueryLoading,
    setCurrentMigrationStep,
    stepItem,
}: {
    isQueryLoading: boolean;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const exportDataContentDescription: string = 'The export function is not yet implemented.';

    const next = () => {
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.SelectMigrateTarget);
    };

    return (
        <>
            {isQueryLoading ? (
                <Spin tip='Loading' size='large'>
                    <div className={serviceOrderStyles.migrateExportImportDataClass} />
                </Spin>
            ) : (
                <>
                    <div className={serviceOrderStyles.migrateExportImportDataClass}>
                        {exportDataContentDescription}
                    </div>
                    <div className={serviceOrderStyles.migrateStepButtonInnerClass}>
                        <Space size={'large'}>
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
            )}
        </>
    );
};
