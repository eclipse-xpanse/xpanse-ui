import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { ServiceVo } from '../../../xpanse-api/generated';
import useListDeployedServicesQuery from '../myServices/query/useListDeployedServicesQuery';
import { ServicesDashboardSkeleton } from './ServicesDashboardSkeleton';
import ServicesDashboardError from './ServicesDashboardError';

export function ServicesDashboard(): React.JSX.Element {
    const listDeployedServicesQuery = useListDeployedServicesQuery();

    if (listDeployedServicesQuery.isError) {
        return <ServicesDashboardError error={listDeployedServicesQuery.error} />;
    }

    if (listDeployedServicesQuery.isPending || listDeployedServicesQuery.isFetching) {
        return <ServicesDashboardSkeleton />;
    }

    if (listDeployedServicesQuery.data.length > 0) {
        let successfulDeploymentsCount: number = 0;
        let failedDeploymentsCount: number = 0;
        let successfulDestroysCount: number = 0;
        let failedDestroysCount: number = 0;
        listDeployedServicesQuery.data.forEach((serviceItem: ServiceVo) => {
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

        return (
            <>
                <Card title='Services Dashboard' bordered={true}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDeploymentsCount}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeploymentsCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDestroysCount}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroysCount}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Col>
                    </Row>
                </Card>
            </>
        );
    }

    return <></>;
}
