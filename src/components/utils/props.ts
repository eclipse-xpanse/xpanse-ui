/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export const cspValues = [
    'huawei',
    'flexibleEngine',
    'openstack',
    'scs',
    'alicloud',
    'aws',
    'azure',
    'google',
] as const;

export const serviceDeploymentStates = [
    'deploying',
    'deployment successful',
    'deployment failed',
    'destroying',
    'destroy successful',
    'destroy failed',
    'manual cleanup required',
    'rollback failed',
    'modifying',
    'modification failed',
    'modification successful',
] as const;

export const categories = [
    'ai',
    'compute',
    'container',
    'storage',
    'network',
    'database',
    'mediaService',
    'security',
    'middleware',
    'others',
] as const;

export const serviceHostingType = ['self', 'service-vendor'];

export const deploymentKind = ['terraform', 'opentofu'];

export const serviceStates = ['not running', 'running', 'starting', 'stopping', 'stopped', 'restarting'] as const;
