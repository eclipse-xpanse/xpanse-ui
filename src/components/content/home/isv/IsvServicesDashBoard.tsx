/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Card, Col, Divider, Row, Statistic } from 'antd';
import '../../../../styles/dashboard.css';
import { ServiceVo } from '../../../../xpanse-api/generated';
import useListDeployedServicesByIsvQuery from '../../myServices/query/useListDeployedServiceByIsvQuery';
import IsvServicesDashBoardError from './IsvServicesDashBoardError';
import { ServicesDashboardByIsvSkeleton } from './IsvServicesDashBoardSkeleton';
import useListRegisteredServicesQuery from './useListRegisteredServicesQuery';

export function IsvServicesDashBoard(): React.JSX.Element {
    const listDeployedServicesByIsvQuery = useListDeployedServicesByIsvQuery();
    const listRegisteredServicesByIsvQuery = useListRegisteredServicesQuery();
    let successfulDeploymentsCount: number = 0;
    let failedDeploymentsCount: number = 0;
    let successfulDestroysCount: number = 0;
    let failedDestroysCount: number = 0;
    let registeredServicesCount: number = 0;

    if (listDeployedServicesByIsvQuery.data !== undefined && listDeployedServicesByIsvQuery.data.length > 0) {
        listDeployedServicesByIsvQuery.data.forEach((serviceItem: ServiceVo) => {
            if (serviceItem.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
                successfulDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED) {
                failedDeploymentsCount++;
            }
            if (serviceItem.serviceDeploymentState === ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL) {
                successfulDestroysCount++;
            }
            if (serviceItem.serviceDeploymentState === ServiceVo.serviceDeploymentState.DESTROY_FAILED) {
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

        return <IsvServicesDashBoardError error={errorToDisplay} />;
    }

    if (
        listDeployedServicesByIsvQuery.isPending ||
        listDeployedServicesByIsvQuery.isFetching ||
        listRegisteredServicesByIsvQuery.isPending ||
        listRegisteredServicesByIsvQuery.isFetching
    ) {
        return <ServicesDashboardByIsvSkeleton />;
    }

    return (
        <>
            <Card title='Services Dashboard' bordered={true}>
                <Row gutter={16} justify='start'>
                    <Col span={12} className={'dashboard-container-class'}>
                        <Statistic
                            title='Services Registered'
                            value={registeredServicesCount}
                            loading={listDeployedServicesByIsvQuery.isLoading}
                            valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                            className={'clickable-dashboard-links'}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16} justify={'start'}>
                    <Col span={12} className={'dashboard-container-class'}>
                        <Statistic
                            title='Successful Deployments'
                            loading={listDeployedServicesByIsvQuery.isLoading}
                            value={successfulDeploymentsCount}
                            valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                            className={'clickable-dashboard-links'}
                        />
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <Statistic
                            title='Failed Deployments'
                            value={failedDeploymentsCount}
                            loading={listDeployedServicesByIsvQuery.isLoading}
                            valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                            className={'clickable-dashboard-links'}
                        />
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <Statistic
                            title='Successful Destroys'
                            loading={listDeployedServicesByIsvQuery.isLoading}
                            value={successfulDestroysCount}
                            valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                            className={'clickable-dashboard-links'}
                        />
                    </Col>
                    <Col span={12} className={'dashboard-container-class'}>
                        <Statistic
                            title='Failed Destroys'
                            value={failedDestroysCount}
                            loading={listDeployedServicesByIsvQuery.isLoading}
                            valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                            className={'clickable-dashboard-links'}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
}
