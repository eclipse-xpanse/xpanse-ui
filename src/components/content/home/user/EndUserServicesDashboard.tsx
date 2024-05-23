/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import dashboardStyles from '../../../../styles/dashboard.module.css';
import { DeployedService } from '../../../../xpanse-api/generated';
import { myServicesRoute } from '../../../utils/constants';
import useListDeployedServicesQuery from '../../deployedServices/myServices/query/useListDeployedServicesDetailsQuery';
import DashBoardError from '../common/DashBoardError';
import { DashBoardSkeleton } from '../common/DashBoardSkeleton';
import serviceDeploymentState = DeployedService.serviceDeploymentState;

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
            if (
                serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL
            ) {
                successfulDeploymentsCount++;
            }
            if (
                serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED ||
                serviceItem.serviceDeploymentState === DeployedService.serviceDeploymentState.MODIFICATION_FAILED
            ) {
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

    const getMyServicesRedirectionUrl = (serviceState: DeployedService.serviceDeploymentState[]) => {
        navigate({
            pathname: myServicesRoute,
            search: createSearchParams({
                serviceState: serviceState,
            }).toString(),
        });
    };

    return (
        <>
            <Card title='Services Dashboard' bordered={true}>
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl([
                                    serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                                    serviceDeploymentState.MODIFICATION_SUCCESSFUL,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDeploymentsCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl([
                                    serviceDeploymentState.DEPLOYMENT_FAILED,
                                    serviceDeploymentState.MODIFICATION_FAILED,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeploymentsCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl([serviceDeploymentState.DESTROY_SUCCESSFUL]);
                            }}
                        >
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDestroysCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl([serviceDeploymentState.DESTROY_FAILED]);
                            }}
                        >
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroysCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}
