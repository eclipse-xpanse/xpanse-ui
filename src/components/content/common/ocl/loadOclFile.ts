/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import YAML from 'yaml';
import { Ocl } from '../../../../xpanse-api/generated';

function loadOclFile(fileData: string): Ocl {
    return YAML.parse(fileData) as Ocl;
}

export default loadOclFile;
