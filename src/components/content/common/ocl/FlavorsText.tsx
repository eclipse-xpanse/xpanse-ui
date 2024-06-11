/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover } from 'antd';
import React from 'react';
import YAML from 'yaml';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';

export function FlavorsText({ flavors }: { flavors: ServiceFlavor[] }): React.JSX.Element {
    // These warnings must be suppressed because the Ocl object here is created from the import file and the data not necessarily contains all the mandatory fields.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (flavors) {
        const flavorPops: React.JSX.Element[] = flavors.map((flavor, index) => {
            const yamlDocument = new YAML.Document();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            yamlDocument.contents = flavor;
            return (
                <li key={index}>
                    <Popover
                        content={
                            <pre className={oclDisplayStyles.oclFlavorsItemContent}>{yamlDocument.toString()}</pre>
                        }
                        title='Flavor Details'
                        trigger='hover'
                    >
                        <Button className={oclDisplayStyles.oclDataHover} type='link'>
                            {flavor.name}
                        </Button>
                    </Popover>
                </li>
            );
        });

        return <ul>{flavorPops}</ul>;
    }
    return <></>;
}
