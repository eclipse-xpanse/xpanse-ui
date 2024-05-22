/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

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
                className={serviceOrderStyles.orderNavigate}
            >
                {text}
            </div>
        </div>
    );
}

export default NavigateOrderSubmission;
