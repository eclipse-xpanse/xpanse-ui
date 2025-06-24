/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardStyles from '../../../../styles/dashboard.module.css';
import { DeployedService, serviceDeploymentState } from '../../../../xpanse-api/generated';
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

    if (listDeployedServicesQuery.data.length > 0) {
        listDeployedServicesQuery.data.forEach((serviceItem: DeployedService) => {
            if (
                serviceItem.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.MODIFICATION_SUCCESSFUL
            ) {
                successfulDeploymentsCount++;
            }
            if (
                serviceItem.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_FAILED ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.MODIFICATION_FAILED ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.ROLLBACK_FAILED
            ) {
                failedDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === serviceDeploymentState.DESTROY_SUCCESSFUL) {
                successfulDestroysCount++;
            }
            if (serviceItem.serviceDeploymentState === serviceDeploymentState.DESTROY_FAILED) {
                failedDestroysCount++;
            }
        });
    }

    const getMyServicesRedirectionUrl = (serviceDeploymentStates: serviceDeploymentState[]) => {
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
                                    serviceDeploymentState.ROLLBACK_FAILED,
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
