/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import submitResultStyles from '../../../../styles/submit-result.module.css';
import { DeployedServiceDetails } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';
import { OperationType } from '../types/OperationType';

export const ProcessingStatus = ({
    response,
    operationType,
}: {
    response: DeployedServiceDetails;
    operationType: OperationType;
}): React.JSX.Element => {
    const endPointMap = new Map<string, string>();
    if (operationType === (OperationType.Deploy as OperationType)) {
        if (response.serviceDeploymentState.toString() === 'deployment successful') {
            if (response.deployedServiceProperties) {
                for (const key in response.deployedServiceProperties) {
                    endPointMap.set(key, response.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <>
                        <span>{'Deployment Successful'}</span>
                        <div className={submitResultStyles.resultContainer}>
                            {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                        </div>
                    </>
                );
            } else {
                return <span>{'Deployment Successful'}</span>;
            }
        } else if (response.serviceDeploymentState.toString() === 'deployment failed') {
            return (
                <div>
                    <span>{'Deployment Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }

    if (operationType === (OperationType.Modify as OperationType)) {
        if (response.serviceDeploymentState.toString() === 'modification successful') {
            if (response.deployedServiceProperties) {
                for (const key in response.deployedServiceProperties) {
                    endPointMap.set(key, response.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <>
                        <span>{'Modification Successful'}</span>
                        <div className={submitResultStyles.resultContainer}>
                            {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                        </div>
                    </>
                );
            } else {
                return <span>{'Modification Successful'}</span>;
            }
        } else if (response.serviceDeploymentState.toString() === 'modification failed') {
            return (
                <div>
                    <span>{'Modification Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }

    if (operationType === (OperationType.Destroy as OperationType)) {
        if (response.serviceDeploymentState.toString() === 'destroy successful') {
            return (
                <div>
                    <span>{'Destroyed Successfully'}</span>
                </div>
            );
        } else if (response.serviceDeploymentState.toString() === 'destroy failed') {
            return (
                <div>
                    <span>{'Destroyed Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }
    return <></>;
};
