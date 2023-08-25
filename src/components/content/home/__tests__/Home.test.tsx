/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import Home from '../Home';
import { render, screen } from '@testing-library/react';

describe('Test Home Page', () => {
    it('should render Xpanse Website URLs', () => {
        render(<Home />);

        expect(screen.getByText('Getting started with Xpanse')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Getting started with Xpanse' })).toHaveAttribute(
            'href',
            'https://eclipse.dev/xpanse'
        );

        expect(screen.getByText('Xpanse Service Description Language')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Xpanse Service Description Language' })).toHaveAttribute(
            'href',
            'https://eclipse.dev/xpanse/docs/api'
        );
    });
});
