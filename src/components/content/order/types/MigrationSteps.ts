/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export enum MigrationSteps {
    ExportServiceData = 0,
    SelectADestination = 1,
    DeployServiceOnTheNewDestination = 2,
    ImportServiceData = 3,
    DestroyTheOldService = 4,
}
