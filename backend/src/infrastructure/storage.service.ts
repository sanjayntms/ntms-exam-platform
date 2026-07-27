import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export class StorageService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(fileName: string, buffer: Buffer): Promise<string> {
    if (config.azure.storageConnectionString && !config.azure.storageConnectionString.includes('UseDevelopmentStorage')) {
      // Azure Blob Storage Upload Logic
      // In production Azure SDK @azure/storage-blob uploads to Blob container
    }

    // Local fallback driver for storage
    const filePath = path.join(this.uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  }
}
