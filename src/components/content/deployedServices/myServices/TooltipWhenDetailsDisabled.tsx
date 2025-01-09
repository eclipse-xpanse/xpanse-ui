/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType.ts';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText.tsx';

export const TooltipWhenDetailsDisabled = ({
    serviceProviderContactDetails,
}: {
    serviceProviderContactDetails: ServiceProviderContactDetails;
}): React.JSX.Element => {
    return (
        <div>
            <span>Please contact the service provider</span>
            <ContactDetailsText
                serviceProviderContactDetails={serviceProviderContactDetails}
                showFor={ContactDetailsShowType.Order}
            />
        </div>
    );
};
