/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button } from 'antd';
import React from 'react';
import { To, useNavigate } from 'react-router-dom';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { useOrderFormStore } from '../store/OrderFormStore';

function NavigateOrderSubmission({
    text,
    to,
    props,
    disabled,
}: {
    text: string;
    to: To;
    props?: OrderSubmitProps;
    disabled: boolean;
}): React.JSX.Element {
    const navigate = useNavigate();
    const [resetFormCache] = useOrderFormStore((state) => [state.clearFormVariables]);

    function goBack(props: OrderSubmitProps | undefined) {
        const toUrl: string = to as string;
        if (toUrl.includes(servicesSubPageRoute)) {
            resetFormCache();
        }
        void navigate(to, { state: props });
    }

    return (
        <Button
            type='primary'
            onClick={() => {
                goBack(props);
            }}
            className={serviceOrderStyles.orderNavigate}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}

export default NavigateOrderSubmission;
