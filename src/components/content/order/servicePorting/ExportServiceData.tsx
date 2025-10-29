/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space, Spin, StepProps } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';

export const ExportServiceData = ({
    isQueryLoading,
    setCurrentMigrationStep,
    updateCurrentStepStatus,
}: {
    isQueryLoading: boolean;
    setCurrentMigrationStep: (currentMigrationStep: ServicePortingSteps) => void;
    updateCurrentStepStatus: (currentStep: ServicePortingSteps, stepState: StepProps['status']) => void;
}): React.JSX.Element => {
    const exportDataContentDescription: string = 'The export function is not yet implemented.';

    const next = () => {
        updateCurrentStepStatus(ServicePortingSteps.ExportServiceData, 'finish');
        setCurrentMigrationStep(ServicePortingSteps.SelectPortingTarget);
    };

    return (
        <>
            {isQueryLoading ? (
                <Spin tip='Loading' size='large'>
                    <div className={serviceOrderStyles.portingExportImportDataClass} />
                </Spin>
            ) : (
                <>
                    <div className={serviceOrderStyles.portingExportImportDataClass}>
                        {exportDataContentDescription}
                    </div>
                    <div className={serviceOrderStyles.portingStepButtonInnerClass}>
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
