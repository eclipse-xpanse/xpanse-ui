/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region, ServiceProviderContactDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { orderPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import useGetAvailabilityZonesForRegionQuery from '../common/utils/useGetAvailabilityZonesForRegionQuery';

export default function GoToSubmit({
    selectedVersion,
    selectedCsp,
    region,
    selectedFlavor,
    versionMapper,
    selectedServiceHostingType,
    currentServiceProviderContactDetails,
    availabilityZones,
    isDisableNextButton,
}: {
    selectedVersion: string;
    selectedCsp: UserOrderableServiceVo.csp;
    region: Region;
    selectedFlavor: string;
    selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    versionMapper: Map<string, UserOrderableServiceVo[]>;
    currentServiceProviderContactDetails: ServiceProviderContactDetails | undefined;
    availabilityZones: Record<string, string> | undefined;
    isDisableNextButton: boolean;
}): React.JSX.Element {
    const navigate = useNavigate();
    useGetAvailabilityZonesForRegionQuery(selectedCsp, region.name);
    const gotoOrderSubmit = function () {
        const orderSubmitParams: OrderSubmitProps = getDeployParams(
            versionMapper.get(selectedVersion) ?? [],
            selectedCsp,
            selectedServiceHostingType,
            region,
            selectedFlavor,
            currentServiceProviderContactDetails,
            availabilityZones
        );

        navigate(
            orderPageRoute
                .concat('?serviceName=', orderSubmitParams.name)
                .concat('&version=', orderSubmitParams.version)
                .concat('#', orderSubmitParams.category),
            {
                state: orderSubmitParams,
            }
        );
    };

    return (
        <>
            <div className={'order-param-item-row'}>
                <div className={'order-param-item-left'} />
                <div className={'order-param-submit'}>
                    <Button type='primary' onClick={gotoOrderSubmit} disabled={isDisableNextButton}>
                        &nbsp;&nbsp;Next&nbsp;&nbsp;
                    </Button>
                </div>
            </div>
        </>
    );
}
