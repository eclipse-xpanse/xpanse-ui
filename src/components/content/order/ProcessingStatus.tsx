/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceDetailVo } from '../../../xpanse-api/generated';
import { convertMapToUnorderedList } from '../../utils/generateUnorderedList';
import serviceState = ServiceDetailVo.serviceState;
import { OperationType } from './formElements/CommonTypes';

export const ProcessingStatus = (response: ServiceDetailVo, operationType: OperationType): JSX.Element => {
    const endPointMap = new Map<string, string>();
    if (operationType === (OperationType.Deploy as OperationType)) {
        if (response.serviceState === serviceState.DEPLOY_SUCCESS) {
            if (response.deployedServiceProperties) {
                for (const key in response.deployedServiceProperties) {
                    endPointMap.set(key, response.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <div>
                        <span>{'Deployment Successful'}</span>
                        <div>{convertMapToUnorderedList(endPointMap, 'Endpoint Information')}</div>
                    </div>
                );
            } else {
                return <span>{'Deployment Successful'}</span>;
            }
        } else if (response.serviceState === serviceState.DEPLOY_FAILED) {
            return (
                <div>
                    <span>{'Deployment Failed.'}</span>
                    <div>{response.resultMessage}</div>
                </div>
            );
        }
    }

    if (operationType === (OperationType.Destroy as OperationType)) {
        if (response.serviceState === serviceState.DESTROY_SUCCESS) {
            return (
                <div>
                    <span>{'Destroyed Successfully'}</span>
                </div>
            );
        } else if (response.serviceState === serviceState.DESTROY_FAILED) {
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
