import { expect, Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export async function isElementFullyVisibleInsideViewport(page: Page, element: Locator): Promise<boolean> {
    const boundingBox = await element.boundingBox();
    expect(boundingBox).not.toBeNull(); // Ensure the bounding box exists

    // Get viewport size
    const viewportSize = page.viewportSize();

    if (boundingBox && viewportSize) {
        return (
            boundingBox.x >= 0 &&
            boundingBox.y >= 0 &&
            boundingBox.x + boundingBox.width <= viewportSize.width &&
            boundingBox.y + boundingBox.height <= viewportSize.height
        );
    }
    return false;
}
