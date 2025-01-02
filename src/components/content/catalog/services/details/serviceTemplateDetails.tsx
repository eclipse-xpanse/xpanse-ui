import { EnvironmentOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { ServicePolicies } from '../policies/ServicePolicies';
import ServiceDetail from './ServiceDetail';
import { ServiceHostingOptions } from './ServiceHostingOptions';
import ServiceTemplateState from './serviceTemplateState';

function serviceTemplateDetails({
    isViewDisabled,
    serviceDetails,
    groupServiceTemplatesByCsp,
    serviceCspInQuery,
    serviceHostingTypeInQuery,
    onChangeServiceHostingType,
}: {
    isViewDisabled: boolean;
    serviceDetails: ServiceTemplateDetailVo;
    groupServiceTemplatesByCsp: Map<string, ServiceTemplateDetailVo[]>;
    serviceCspInQuery: string;
    serviceHostingTypeInQuery: string;
    onChangeServiceHostingType: (serviceTemplateDetailVo: ServiceTemplateDetailVo) => void;
}): React.JSX.Element {
    return (
        <>
            <Card className={catalogStyles.serviceTemplateCard}>
                <ServiceTemplateState serviceDetails={serviceDetails} />
                <div className={catalogStyles.catalogDetailsH3}>
                    <EnvironmentOutlined />
                    &nbsp;Service Hosting Options
                </div>
                <ServiceHostingOptions
                    serviceTemplateDetailVos={groupServiceTemplatesByCsp.get(serviceCspInQuery) ?? []}
                    defaultDisplayedService={serviceDetails}
                    serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                    updateServiceHostingType={onChangeServiceHostingType}
                />
                <ServiceDetail serviceDetails={serviceDetails} />
                <ServicePolicies
                    key={serviceDetails.serviceTemplateId}
                    serviceDetails={serviceDetails}
                    isViewDisabled={isViewDisabled}
                />
            </Card>
        </>
    );
}
export default serviceTemplateDetails;
