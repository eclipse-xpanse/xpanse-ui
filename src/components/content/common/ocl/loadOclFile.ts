/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Ocl } from '../../../../xpanse-api/generated';
import YAML from 'yaml';

function loadOclFile(fileData: string): Ocl {
    return YAML.parse(fileData) as Ocl;
}

export default loadOclFile;
