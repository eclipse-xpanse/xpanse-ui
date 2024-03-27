/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Deployment scripts hosted on a GIT repo. Either deployer or deployFromGitRepo must be provided.
 */
export type ScriptsRepo = {
    /**
     * URL of the repo
     */
    repoUrl: string;
    /**
     * Branch to be checked out. Can be branch or a Tag
     */
    branch: string;
    /**
     * Directory in the repo where scripts are present. If not provided, the root directory of the repo is considered
     */
    scriptsPath?: string;
};
