/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export enum MigrationSteps {
    ExportServiceData = 0,
    SelectADestination = 1,
    PrepareDeploymentParameters = 2,
    ImportServiceData = 3,
    MigrateService = 4,
}
