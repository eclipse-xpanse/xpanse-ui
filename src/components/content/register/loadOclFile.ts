/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Ocl } from '../../../xpanse-api/generated';
import { ObjectSerializer } from '../../../xpanse-api/generated/models/ObjectSerializer';

function loadOclFile(fileData: string): Ocl {
    return ObjectSerializer.deserialize(ObjectSerializer.parse(fileData, 'application/yaml'), 'Ocl', '');
}

export default loadOclFile;
