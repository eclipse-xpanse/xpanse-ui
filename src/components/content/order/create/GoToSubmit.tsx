/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceProviderContactDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { Button } from 'antd';
import { OrderSubmitProps } from './OrderSubmit';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { orderPageRoute } from '../../../utils/constants';

export default function GoToSubmit({
    selectedVersion,
    selectedCsp,
    selectedRegion,
    selectedArea,
    selectedFlavor,
    versionMapper,
    selectedServiceHostingType,
    currentServiceProviderContactDetails,
}: {
    selectedVersion: string;
    selectedCsp: UserOrderableServiceVo.csp;
    selectedRegion: string;
    selectedArea: string;
    selectedFlavor: string;
    selectedServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    versionMapper: Map<string, UserOrderableServiceVo[]>;
    currentServiceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const navigate = useNavigate();

    const gotoOrderSubmit = function () {
        const orderSubmitParams: OrderSubmitProps = getDeployParams(
            versionMapper.get(selectedVersion) ?? [],
            selectedCsp,
            selectedServiceHostingType,
            selectedArea,
            selectedRegion,
            selectedFlavor,
            currentServiceProviderContactDetails
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
                    <Button type='primary' onClick={gotoOrderSubmit}>
                        &nbsp;&nbsp;Next&nbsp;&nbsp;
                    </Button>
                </div>
            </div>
        </>
    );
}
