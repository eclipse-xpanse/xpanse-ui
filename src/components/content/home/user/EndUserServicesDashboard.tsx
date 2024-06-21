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

export function EndUserServicesDashboard(): React.JSX.Element {
    const listDeployedServicesQuery = useListDeployedServicesQuery();
    const navigate = useNavigate();
    let successfulDeploymentsCount: number = 0;
    let failedDeploymentsCount: number = 0;
    let successfulDestroysCount: number = 0;
    let failedDestroysCount: number = 0;

    const retryRequest = () => {
        if (listDeployedServicesQuery.isError) {
            void listDeployedServicesQuery.refetch();
        }
    };

    if (listDeployedServicesQuery.isError) {
        return <DashBoardError error={listDeployedServicesQuery.error} retryRequest={retryRequest} />;
    }

    if (listDeployedServicesQuery.isPending || listDeployedServicesQuery.isFetching) {
        return <DashBoardSkeleton />;
    }

    if (listDeployedServicesQuery.data.length > 0) {
        listDeployedServicesQuery.data.forEach((serviceItem: DeployedService) => {
            if (
                serviceItem.serviceDeploymentState.toString() === 'deployment successful' ||
                serviceItem.serviceDeploymentState.toString() === 'modification successful'
            ) {
                successfulDeploymentsCount++;
            }
            if (
                serviceItem.serviceDeploymentState.toString() === 'deployment failed' ||
                serviceItem.serviceDeploymentState.toString() === 'modification failed'
            ) {
                failedDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState.toString() === 'destroy successful') {
                successfulDestroysCount++;
            }
            if (serviceItem.serviceDeploymentState.toString() === 'destroy failed') {
                failedDestroysCount++;
            }
        });
    }

    const getMyServicesRedirectionUrl = (serviceState: DeployedService['serviceDeploymentState'][]) => {
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
                                getMyServicesRedirectionUrl(['deployment successful', 'modification successful']);
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
                                getMyServicesRedirectionUrl(['deployment failed', 'modification failed']);
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
                                getMyServicesRedirectionUrl(['destroy successful']);
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
                                getMyServicesRedirectionUrl(['destroy failed']);
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
