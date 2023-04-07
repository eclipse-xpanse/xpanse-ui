/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useNavigate, To } from 'react-router-dom';
import '../../../styles/service_order.css';
import { OrderSubmitProps } from './OrderSubmit';

function Navigate({ text, to, props }: { text: string; to: To; props?: OrderSubmitProps }): JSX.Element {
    const navigate = useNavigate();

    function goBack(props: OrderSubmitProps | undefined) {
        navigate(to, { state: props });
    }

    return (
        <div>
            <div onClick={() => goBack(props)} className='order-navigate'>
                {text}
            </div>
        </div>
    );
}

export default Navigate;
