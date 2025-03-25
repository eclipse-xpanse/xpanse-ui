/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';

import React from 'react';
import { useStopwatchResultType } from 'react-timer-hook/dist/types/src/useStopwatch';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import DeploymentTimer from '../orderStatus/DeploymentTimer';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export const RecreateOrderSubmitResult = ({
    msg,
    serviceId,
    orderId,
    type,
    stopWatch,
    closeRecreateResultAlert,
    contactServiceDetails,
}: {
    msg: string | React.JSX.Element;
    serviceId: string;
    orderId: string;
    type: 'success' | 'error';
    stopWatch: useStopwatchResultType;
    closeRecreateResultAlert: (arg: boolean) => void;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element => {
    const onClose = () => {
        closeRecreateResultAlert(true);
    };

    return (
        <div className={submitAlertStyles.submitAlertTip}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} serviceId={serviceId} orderId={orderId} />}
                showIcon
                closable={true}
                onClose={onClose}
                type={type}
                action={
                    <>
                        {contactServiceDetails !== undefined ? (
                            <ContactDetailsText
                                serviceProviderContactDetails={contactServiceDetails}
                                showFor={ContactDetailsShowType.Order}
                            />
                        ) : (
                            <></>
                        )}
                        <DeploymentTimer stopWatch={stopWatch} />
                    </>
                }
            />{' '}
        </div>
    );
};
