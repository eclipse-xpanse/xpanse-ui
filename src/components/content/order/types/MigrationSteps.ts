/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export enum MigrationSteps {
    ExportServiceData = 0,
    SelectMigrateTarget = 1,
    SelectADestination = 2,
    PrepareDeploymentParameters = 3,
    ImportServiceData = 4,
    MigrateService = 5,
}
