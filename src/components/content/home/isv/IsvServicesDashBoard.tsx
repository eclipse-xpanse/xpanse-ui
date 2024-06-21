/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Divider, Row, Statistic } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import dashboardStyles from '../../../../styles/dashboard.module.css';
import { DeployedService } from '../../../../xpanse-api/generated';
import { catalogPageRoute, reportsRoute } from '../../../utils/constants';
import useListDeployedServicesByIsvQuery from '../../deployedServices/myServices/query/useListDeployedServiceByIsvQuery';
import DashBoardError from '../common/DashBoardError';
import { DashBoardSkeleton } from '../common/DashBoardSkeleton';
import useListRegisteredServicesQuery from './useListRegisteredServicesQuery';

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
    };

    if (listDeployedServicesByIsvQuery.data !== undefined && listDeployedServicesByIsvQuery.data.length > 0) {
        listDeployedServicesByIsvQuery.data.forEach((serviceItem: DeployedService) => {
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

    if (listRegisteredServicesByIsvQuery.data !== undefined && listRegisteredServicesByIsvQuery.data.length > 0) {
        registeredServicesCount = listRegisteredServicesByIsvQuery.data.length;
    }

    if (listDeployedServicesByIsvQuery.isError || listRegisteredServicesByIsvQuery.isError) {
        const errorToDisplay = listDeployedServicesByIsvQuery.isError
            ? listDeployedServicesByIsvQuery.error
            : listRegisteredServicesByIsvQuery.error;

        return <DashBoardError error={errorToDisplay} retryRequest={retryRequest} />;
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
        navigate({
            pathname: catalogPageRoute,
            hash: '#' + (registeredServicesCount > 0 ? listRegisteredServicesByIsvQuery.data[0].category : 'ai'),
        });
    };

    const getReportsRedirectionUrl = (serviceState: DeployedService['serviceDeploymentState'][]) => {
        navigate({
            pathname: reportsRoute,
            search: createSearchParams({
                serviceState: serviceState,
            }).toString(),
        });
    };

    return (
        <>
            <Card title='Services Dashboard' bordered={true}>
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
                                getReportsRedirectionUrl(['deployment successful', 'modification successful']);
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
                                getReportsRedirectionUrl(['deployment failed', 'modification failed']);
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
                                getReportsRedirectionUrl(['destroy successful']);
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
                                getReportsRedirectionUrl(['destroy failed']);
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
