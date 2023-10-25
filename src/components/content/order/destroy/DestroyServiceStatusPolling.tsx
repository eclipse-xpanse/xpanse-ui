/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError, Response, ServiceDetailVo } from '../../../../xpanse-api/generated';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import React, { useEffect } from 'react';
import { Alert } from 'antd';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

function DestroyServiceStatusPolling({
    uuid,
    isError,
    error,
    setIsDestroyingCompleted,
    getDestroyCloseStatus,
}: {
    uuid: string;
    isError: boolean;
    error: Error | null;
    setIsDestroyingCompleted: (arg: boolean) => void;
    getDestroyCloseStatus: (arg: boolean) => void;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid, [
        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
        ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
    ]);

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.isSuccess &&
            [
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ].includes(getServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            setIsDestroyingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.isSuccess, getServiceDetailsByIdQuery.data, setIsDestroyingCompleted]);

    useEffect(() => {
        if (isError) {
            setIsDestroyingCompleted(true);
        }
    }, [isError, setIsDestroyingCompleted]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsDestroyingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.isError, setIsDestroyingCompleted]);

    const onClose = () => {
        getDestroyCloseStatus(true);
    };

    if (isError) {
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    if (uuid && getServiceDetailsByIdQuery.isError) {
        if (
            getServiceDetailsByIdQuery.error instanceof ApiError &&
            'details' in getServiceDetailsByIdQuery.error.body
        ) {
            const response: Response = getServiceDetailsByIdQuery.error.body as Response;
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    if (uuid && getServiceDetailsByIdQuery.data !== undefined)
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
        ) {
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={<OrderSubmitResultDetails msg={'Service destroyed successfully'} uuid={uuid} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
        ) {
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={<OrderSubmitResultDetails msg={'Destroy failed'} uuid={uuid} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }

    return <></>;
}

export default DestroyServiceStatusPolling;
