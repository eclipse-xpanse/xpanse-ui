/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardStyles from '../../../../styles/dashboard.module.css';
import { DeployedService, ServiceDeploymentState } from '../../../../xpanse-api/generated';
import { myServicesRoute, serviceDetailsErrorText } from '../../../utils/constants';
import RetryPrompt from '../../common/error/RetryPrompt.tsx';
import useListDeployedServicesQuery from '../../deployedServices/myServices/query/useListDeployedServicesDetailsQuery';
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
        return (
            <RetryPrompt
                error={listDeployedServicesQuery.error}
                retryRequest={retryRequest}
                errorMessage={serviceDetailsErrorText}
            />
        );
    }

    if (listDeployedServicesQuery.isPending || listDeployedServicesQuery.isFetching) {
        return <DashBoardSkeleton />;
    }

    if (listDeployedServicesQuery.data && listDeployedServicesQuery.data.length > 0) {
        listDeployedServicesQuery.data.forEach((serviceItem: DeployedService) => {
            if (
                serviceItem.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_SUCCESSFUL
            ) {
                successfulDeploymentsCount++;
            }
            if (
                serviceItem.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
                serviceItem.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_FAILED ||
                serviceItem.serviceDeploymentState === ServiceDeploymentState.ROLLBACK_FAILED
            ) {
                failedDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === ServiceDeploymentState.DESTROY_SUCCESSFUL) {
                successfulDestroysCount++;
            }
            if (serviceItem.serviceDeploymentState === ServiceDeploymentState.DESTROY_FAILED) {
                failedDestroysCount++;
            }
        });
    }

    const getMyServicesRedirectionUrl = (serviceDeploymentStates: ServiceDeploymentState[]) => {
        const params = new URLSearchParams();
        serviceDeploymentStates.forEach((state) => {
            params.append('serviceDeploymentState', state);
        });
        void navigate(`${myServicesRoute}?${params.toString()}`);
    };

    return (
        <>
            <Card title='Services Dashboard' variant={'outlined'}>
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getMyServicesRedirectionUrl([
                                    ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                                    ServiceDeploymentState.MODIFICATION_SUCCESSFUL,
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
                                    ServiceDeploymentState.DEPLOYMENT_FAILED,
                                    ServiceDeploymentState.MODIFICATION_FAILED,
                                    ServiceDeploymentState.ROLLBACK_FAILED,
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
                                getMyServicesRedirectionUrl([ServiceDeploymentState.DESTROY_SUCCESSFUL]);
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
                                getMyServicesRedirectionUrl([ServiceDeploymentState.DESTROY_FAILED]);
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
