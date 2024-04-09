/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useNavigate, To } from 'react-router-dom';
import '../../../../styles/service_order.css';
import React from 'react';
import { useOrderFormStore } from '../store/OrderFormStore';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';

function NavigateOrderSubmission({
    text,
    to,
    props,
}: {
    text: string;
    to: To;
    props?: OrderSubmitProps;
}): React.JSX.Element {
    const navigate = useNavigate();
    const [resetFormCache] = useOrderFormStore((state) => [state.clearFormVariables]);
    function goBack(props: OrderSubmitProps | undefined) {
        const toUrl: string = to as string;
        if (toUrl.includes(servicesSubPageRoute)) {
            resetFormCache();
        }
        navigate(to, { state: props });
    }

    return (
        <div>
            <div
                onClick={() => {
                    goBack(props);
                }}
                className='order-navigate'
            >
                {text}
            </div>
        </div>
    );
}

export default NavigateOrderSubmission;
