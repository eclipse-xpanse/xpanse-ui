/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { Button } from 'antd';
import { OrderSubmitProps } from '../create/OrderSubmit';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { orderPageRoute } from '../../../utils/constants';

export default function GoToSubmit({
    selectVersion,
    selectCsp,
    selectRegion,
    selectArea,
    selectFlavor,
    versionMapper,
    selectServiceHostingType,
}: {
    selectVersion: string;
    selectCsp: UserOrderableServiceVo.csp;
    selectRegion: string;
    selectArea: string;
    selectFlavor: string;
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    versionMapper: Map<string, UserOrderableServiceVo[]>;
}): React.JSX.Element {
    const navigate = useNavigate();

    const gotoOrderSubmit = function () {
        const props: OrderSubmitProps = getDeployParams(
            versionMapper.get(selectVersion) ?? [],
            selectCsp,
            selectServiceHostingType,
            selectArea,
            selectRegion,
            selectFlavor
        );

        navigate(orderPageRoute, {
            state: props,
        });
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
