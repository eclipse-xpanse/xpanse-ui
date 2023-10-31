/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface CurrentUserRoleStore {
    currentUserRole: string | undefined;
}

const initialState: CurrentUserRoleStore = {
    currentUserRole: undefined,
};

interface updateState {
    addCurrentUserRole: (currentUserRole: string) => void;
    clearCurrentUserRole: () => void;
}

export const useCurrentUserRoleStore = createWithEqualityFn<CurrentUserRoleStore & updateState>()(
    (set) => ({
        ...initialState,
        addCurrentUserRole: (currentUserRole) => {
            set({ currentUserRole: currentUserRole });
        },
        clearCurrentUserRole: () => {
            set(initialState);
        },
    }),
    shallow
);
