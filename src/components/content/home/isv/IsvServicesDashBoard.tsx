/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Col, Divider, Row, Statistic } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import '../../../../styles/dashboard.css';
import { DeployedService, ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';
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

    if (listDeployedServicesByIsvQuery.data !== undefined && listDeployedServicesByIsvQuery.data.length > 0) {
        listDeployedServicesByIsvQuery.data.forEach((serviceItem: DeployedService) => {
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

    if (listRegisteredServicesByIsvQuery.data !== undefined && listRegisteredServicesByIsvQuery.data.length > 0) {
        registeredServicesCount = listRegisteredServicesByIsvQuery.data.length;
    }

    if (listDeployedServicesByIsvQuery.isError || listRegisteredServicesByIsvQuery.isError) {
        const errorToDisplay = listDeployedServicesByIsvQuery.isError
            ? listDeployedServicesByIsvQuery.error
            : listRegisteredServicesByIsvQuery.error;

        return <DashBoardError error={errorToDisplay} />;
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
            hash:
                '#' +
                (registeredServicesCount > 0
                    ? listRegisteredServicesByIsvQuery.data[0].category
                    : ServiceTemplateDetailVo.category.AI),
        });
    };

    const getReportsRedirectionUrl = (serviceState: DeployedService.serviceDeploymentState[]) => {
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
                    <Col span={12} className={'dashboard-container-class'}>
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
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([
                                    DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                                    DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                value={successfulDeploymentsCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([
                                    DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED,
                                    DeployedService.serviceDeploymentState.MODIFICATION_FAILED,
                                ]);
                            }}
                        >
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeploymentsCount}
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL]);
                            }}
                        >
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesByIsvQuery.isLoading}
                                value={successfulDestroysCount}
                                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                                className={'clickable-dashboard-links'}
                            />
                        </div>
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <div
                            onClick={() => {
                                getReportsRedirectionUrl([DeployedService.serviceDeploymentState.DESTROY_FAILED]);
                            }}
                        >
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroysCount}
                                loading={listDeployedServicesByIsvQuery.isLoading}
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
