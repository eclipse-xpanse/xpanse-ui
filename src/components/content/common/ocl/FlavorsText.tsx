/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceFlavor } from '../../../../xpanse-api/generated';
import React from 'react';
import YAML from 'yaml';
import { Button, Popover } from 'antd';

export function FlavorsText({ flavors }: { flavors: ServiceFlavor[] }): React.JSX.Element {
    // These warnings must be suppressed because the Ocl object here is created from the import file and the data not necessarily contains all the mandatory fields.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (flavors) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = flavors;
        return (
            <Popover content={<pre>{yamlDocument.toString()}</pre>} title={'Flavors'} trigger='hover'>
                <Button
                    className={'ocl-data-hover'}
                    type={'link'}
                >{`Available in ${flavors.length.toString()} flavor(s)`}</Button>
            </Popover>
        );
    }
    return <></>;
}
