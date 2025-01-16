/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export enum ServicePortingSteps {
    ExportServiceData = 0,

    SelectPortingTarget = 1,
    SelectADestination = 2,
    PrepareDeploymentParameters = 3,
    ImportServiceData = 4,
    PortService = 5,
}
