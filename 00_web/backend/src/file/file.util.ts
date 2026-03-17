import { extname } from 'path';

export function createStoredFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = extname(originalName);
    return `${timestamp}-${random}${ext}`;
}

export function normalizeOriginalFileName(originalName: string): string {
    return Buffer.from(originalName, 'latin1').toString('utf8');
}

export function getFileFlags(mimeType: string) {
    const previewableMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

    const isImage = mimeType.startsWith('image/');
    const isVideo = mimeType === 'video/mp4';

    return {
        isPreviewable: previewableMimeTypes.includes(mimeType),
        isImage,
        isVideo,
    };
}
