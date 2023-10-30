/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface CurrentUserRoleStore {
    currentUserRoleStoreParams: string;
}

const initialState: CurrentUserRoleStore = {
    currentUserRoleStoreParams: '',
};

interface updateState {
    addCurrentUserRoleVariable: (currentUserRoleName: string) => void;
    clearFormVariables: () => void;
}

export const useCurrentUserRoleStore = createWithEqualityFn<CurrentUserRoleStore & updateState>()(
    (set) => ({
        ...initialState,
        addCurrentUserRoleVariable: (currentUserRoleName) => {
            set({ currentUserRoleStoreParams: currentUserRoleName });
        },
        clearFormVariables: () => {
            set(initialState);
        },
    }),
    shallow
);
