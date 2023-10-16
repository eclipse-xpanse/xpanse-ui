/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceDetailVo } from '../../../../xpanse-api/generated';
import { OperationType } from '../formElements/CommonTypes';
import React from 'react';
import { convertMapToDetailsList } from '../../common/convertMapToDetailsList';

export const ProcessingStatus = (response: ServiceDetailVo, operationType: OperationType): React.JSX.Element => {
    const endPointMap = new Map<string, string>();
    if (operationType === (OperationType.Deploy as OperationType)) {
        if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
            if (response.deployedServiceProperties) {
                for (const key in response.deployedServiceProperties) {
                    endPointMap.set(key, response.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <>
                        <span>{'Deployment Successful'}</span>
                        <div className={'service-instance-detail-position'}>
                            {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                        </div>
                    </>
                );
            } else {
                return <span>{'Deployment Successful'}</span>;
            }
        } else if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED) {
            return (
                <div>
                    <span>{'Deployment Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }

    if (operationType === (OperationType.Destroy as OperationType)) {
        if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL) {
            return (
                <div>
                    <span>{'Destroyed Successfully'}</span>
                </div>
            );
        } else if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED) {
            return (
                <div>
                    <span>{'Destroyed Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }

    if (operationType === (OperationType.Migrate as OperationType)) {
        if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
            if (response.deployedServiceProperties) {
                for (const key in response.deployedServiceProperties) {
                    endPointMap.set(key, response.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <>
                        <span>{'Migrated Successfully'}</span>
                        <div className={'service-instance-detail-position'}>
                            {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                        </div>
                    </>
                );
            } else {
                return <span>{'Migrated Successfully'}</span>;
            }
        } else if (
            response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED ||
            response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
        ) {
            return (
                <div>
                    <span>{'Migrated Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }
    return <></>;
};
