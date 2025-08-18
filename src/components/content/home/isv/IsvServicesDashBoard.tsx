/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Divider, Row, Statistic } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardStyles from '../../../../styles/dashboard.module.css';
import { Category, DeployedService, ServiceDeploymentState } from '../../../../xpanse-api/generated';
import { catalogPageRoute, reportsRoute, serviceDetailsErrorText } from '../../../utils/constants';
import RetryPrompt from '../../common/error/RetryPrompt.tsx';
import useListDeployedServicesByIsvQuery from '../../deployedServices/myServices/query/useListDeployedServiceByIsvQuery';
import { DashBoardSkeleton } from '../common/DashBoardSkeleton';
import useListRegisteredServicesQuery from './useListRegisteredServicesQuery.tsx';

export function IsvServicesDashBoard(): React.JSX.Element {
    const listDeployedServicesByIsvQuery = useListDeployedServicesByIsvQuery();
    const listRegisteredServicesByIsvQuery = useListRegisteredServicesQuery();
    let successfulDeploymentsCount: number = 0;
    let failedDeploymentsCount: number = 0;
    let successfulDestroysCount: number = 0;
    let failedDestroysCount: number = 0;
    let registeredServicesCount: number = 0;
    const navigate = useNavigate();

    const retryRequest = () => {
        if (listDeployedServicesByIsvQuery.isError) {
            void listDeployedServicesByIsvQuery.refetch();
        }
        if (listRegisteredServicesByIsvQuery.isError) {
            void listRegisteredServicesByIsvQuery.refetch();
        }
    };

    if (listDeployedServicesByIsvQuery.data !== undefined && listDeployedServicesByIsvQuery.data.length > 0) {
        listDeployedServicesByIsvQuery.data.forEach((serviceItem: DeployedService) => {
            if (
                serviceItem.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_SUCCESSFUL
            ) {
                successfulDeploymentsCount++;
            }
            if (
                serviceItem.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
                serviceItem.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_FAILED
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

    if (listRegisteredServicesByIsvQuery.data !== undefined && listRegisteredServicesByIsvQuery.data.length > 0) {
        registeredServicesCount = listRegisteredServicesByIsvQuery.data.length;
    }

    if (listDeployedServicesByIsvQuery.isError) {
        return (
            <RetryPrompt
                error={listDeployedServicesByIsvQuery.error}
                retryRequest={retryRequest}
                errorMessage={serviceDetailsErrorText}
            />
        );
    }

    if (listRegisteredServicesByIsvQuery.isError) {
        return (
            <RetryPrompt
                error={listRegisteredServicesByIsvQuery.error}
                retryRequest={retryRequest}
                errorMessage={serviceDetailsErrorText}
            />
        );
    }

    if (
        listDeployedServicesByIsvQuery.isPending ||
        listDeployedServicesByIsvQuery.isFetching ||
        listRegisteredServicesByIsvQuery.isPending ||
        listRegisteredServicesByIsvQuery.isFetching
    ) {
        return <DashBoardSkeleton />;
    }

    const getCatalogRedirectionUrl = () => {
        void navigate({
            pathname: catalogPageRoute,
            hash:
                '#' +
                (registeredServicesCount > 0 && listRegisteredServicesByIsvQuery.data
                    ? listRegisteredServicesByIsvQuery.data[0].category
                    : Category.AI),
        });
    };

    const getReportsRedirectionUrl = (serviceDeploymentStates: ServiceDeploymentState[]) => {
        const params = new URLSearchParams();
        serviceDeploymentStates.forEach((state) => {
            params.append('serviceDeploymentState', state);
        });
        void navigate(`${reportsRoute}?${params.toString()}`);
    };

    return (
        <>
            <Card title='Services Dashboard' variant={'outlined'}>
                <Row gutter={16} justify='start'>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getCatalogRedirectionUrl();
                            }}
                        >
                            <Statistic
                                title='Services Registered'
                                value={registeredServicesCount}
                                loading={listRegisteredServicesByIsvQuery.isLoading}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([
                                    ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                                    ServiceDeploymentState.MODIFICATION_SUCCESSFUL,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                value={successfulDeploymentsCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([
                                    ServiceDeploymentState.DEPLOYMENT_FAILED,
                                    ServiceDeploymentState.MODIFICATION_FAILED,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeploymentsCount}
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([ServiceDeploymentState.DESTROY_SUCCESSFUL]);
                            }}
                        >
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                value={successfulDestroysCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={dashboardStyles.clickableDashboardLinks}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={dashboardStyles.dashboardContainerClass}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([ServiceDeploymentState.DESTROY_FAILED]);
                            }}
                        >
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroysCount}
                                loading={listDeployedServicesByIsvQuery.isLoading}
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
