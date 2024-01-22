/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import useListDeployedServicesQuery from '../../deployedServices/myServices/query/useListDeployedServicesQuery';
import { myServicesRoute } from '../../../utils/constants';
import { DeployedService } from '../../../../xpanse-api/generated';
import { createSearchParams, useNavigate } from 'react-router-dom';
import serviceDeploymentState = DeployedService.serviceDeploymentState;
import DashBoardError from '../common/DashBoardError';
import { DashBoardSkeleton } from '../common/DashBoardSkeleton';

export function EndUserServicesDashboard(): React.JSX.Element {
    const listDeployedServicesQuery = useListDeployedServicesQuery();
    const navigate = useNavigate();
    let successfulDeploymentsCount: number = 0;
    let failedDeploymentsCount: number = 0;
    let successfulDestroysCount: number = 0;
    let failedDestroysCount: number = 0;

    if (listDeployedServicesQuery.isError) {
        return <DashBoardError error={listDeployedServicesQuery.error} />;
    }

    if (listDeployedServicesQuery.isPending || listDeployedServicesQuery.isFetching) {
        return <DashBoardSkeleton />;
    }

    if (listDeployedServicesQuery.data.length > 0) {
        listDeployedServicesQuery.data.forEach((serviceItem: DeployedService) => {
            if (serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
                successfulDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED) {
                failedDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL) {
                successfulDestroysCount++;
            }
            if (serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DESTROY_FAILED) {
                failedDestroysCount++;
            }
        });
    }

    const getMyServicesRedirectionUrl = (serviceState: DeployedService.serviceDeploymentState) => {
        navigate({
            pathname: myServicesRoute,
            search: createSearchParams({
                serviceState: serviceState.valueOf(),
            }).toString(),
        });
    };

    return (
        <>
            <Card title='Services Dashboard' bordered={true}>
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl(serviceDeploymentState.DEPLOYMENT_SUCCESSFUL);
                            }}
                        >
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDeploymentsCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl(serviceDeploymentState.DEPLOYMENT_FAILED);
                            }}
                        >
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeploymentsCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl(serviceDeploymentState.DESTROY_SUCCESSFUL);
                            }}
                        >
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDestroysCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl(serviceDeploymentState.DESTROY_FAILED);
                            }}
                        >
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroysCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}
