/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    CreateRequestCategoryEnum,
    CreateRequestCspEnum,
    UserAvailableServiceVo,
} from '../../../../xpanse-api/generated';
import { DeployParam } from './CommonTypes';
import { Button } from 'antd';
import { OrderSubmitProps } from '../OrderSubmit';
import { useNavigate } from 'react-router-dom';

export default function GoToSubmit({
    categoryName,
    serviceName,
    selectVersion,
    selectCsp,
    selectRegion,
    selectArea,
    selectFlavor,
    versionMapper,
}: {
    categoryName: string;
    serviceName: string;
    selectVersion: string;
    selectCsp: string;
    selectRegion: string;
    selectArea: string;
    selectFlavor: string;
    versionMapper: Map<string, UserAvailableServiceVo[]>;
}): JSX.Element {
    const navigate = useNavigate();

    const gotoOrderSubmit = function () {
        let service: UserAvailableServiceVo = new UserAvailableServiceVo();
        let registeredServiceId = '';
        versionMapper.forEach((v, k) => {
            if (k === selectVersion) {
                v.forEach((registerService) => {
                    if (registerService.csp === selectCsp) {
                        registeredServiceId = registerService.id;
                        service = registerService;
                    }
                });
            }
        });

        const props: OrderSubmitProps = {
            id: registeredServiceId,
            category: categoryName as CreateRequestCategoryEnum,
            name: serviceName,
            version: selectVersion,
            region: selectRegion,
            area: selectArea,
            csp: selectCsp as CreateRequestCspEnum,
            flavor: selectFlavor,
            params: new Array<DeployParam>(),
        };

        for (const param of service.variables) {
            props.params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example === undefined ? '' : param.example,
                description: param.description,
                value: param.value === undefined ? '' : param.value,
                mandatory: param.mandatory,
                validator: param.validator === undefined ? '' : param.validator,
            });
        }

        navigate('/order', {
            state: {
                props: props,
            },
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
