/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import { StopwatchResult } from 'react-timer-hook';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';

import React from 'react';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import DeploymentTimer from '../orderStatus/DeploymentTimer';

export const MigrationOrderSubmitResult = ({
    msg,
    uuid,
    type,
    stopWatch,
    contactServiceDetails,
}: {
    msg: string | React.JSX.Element;
    uuid: string;
    type: 'success' | 'error';
    stopWatch: StopwatchResult;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element => {
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                closable={true}
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
