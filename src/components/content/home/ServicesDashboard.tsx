import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { myServicesRoute } from '../../utils/constants';
import { ServiceVo } from '../../../xpanse-api/generated';
import useListDeployedServicesQuery from '../myServices/query/useListDeployedServicesQuery';
import ServiceListQueryError from '../myServices/query/ServiceListQueryError';
import ServicesSkeleton from '../order/services/ServicesSkeleton';

export function ServicesDashboard(): React.JSX.Element {
    const [successfulDeployments, setSuccessfulDeployments] = useState<number>(0);
    const [failedDeployments, setFailedDeployments] = useState<number>(0);
    const [successfulDestroys, setSuccessfulDestroys] = useState<number>(0);
    const [failedDestroys, setFailedDestroys] = useState<number>(0);
    const listDeployedServicesQuery = useListDeployedServicesQuery();
    const navigate = useNavigate();

    useEffect(() => {
        let successfulDeploymentsCount: number = 0;
        let failedDeploymentsCount: number = 0;
        let successfulDestroysCount: number = 0;
        let failedDestroysCount: number = 0;
        if (listDeployedServicesQuery.isSuccess && listDeployedServicesQuery.data.length > 0) {
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
        }
        setSuccessfulDeployments(successfulDeploymentsCount);
        setFailedDeployments(failedDeploymentsCount);
        setSuccessfulDestroys(successfulDestroysCount);
        setFailedDestroys(failedDestroysCount);
    }, [listDeployedServicesQuery.data, listDeployedServicesQuery.isSuccess]);

    if (listDeployedServicesQuery.isError) {
        return <ServiceListQueryError error={listDeployedServicesQuery.error} />;
    }

    if (listDeployedServicesQuery.isLoading || listDeployedServicesQuery.isFetching) {
        return <ServicesSkeleton />;
    }

    return (
        <>
            <Card title='Services Dashboard' bordered={true}>
                <Row gutter={16}>
                    <Col span={12}>
                        <div
                            onClick={() => {
                                navigate(myServicesRoute, {
                                    state: ServiceVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                                });
                            }}
                        >
                            <Statistic
                                title='Successful Deployments'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDeployments}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div
                            onClick={() => {
                                navigate(myServicesRoute, {
                                    state: ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED,
                                });
                            }}
                        >
                            <Statistic
                                title='Failed Deployments'
                                value={failedDeployments}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div
                            onClick={() => {
                                navigate(myServicesRoute, {
                                    state: ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
                                });
                            }}
                        >
                            <Statistic
                                title='Successful Destroys'
                                loading={listDeployedServicesQuery.isLoading}
                                value={successfulDestroys}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div
                            onClick={() => {
                                navigate(myServicesRoute, {
                                    state: ServiceVo.serviceDeploymentState.DESTROY_FAILED,
                                });
                            }}
                        >
                            <Statistic
                                title='Failed Destroys'
                                value={failedDestroys}
                                loading={listDeployedServicesQuery.isLoading}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}
