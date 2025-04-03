import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const targetDir = path.join(__dirname, '../common/register');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

export async function downloadFile(url: string, filePath: string): Promise<void> {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    function waitForTimeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const response = await fetch(url);
    await waitForTimeout(5000);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const fileStream = fs.createWriteStream(filePath);

    async function pump(): Promise<void> {
        const { done, value } = await reader.read();
        if (done) {
            fileStream.end();
            return;
        }
        fileStream.write(value);
        await pump();
    }

    await pump();
}
