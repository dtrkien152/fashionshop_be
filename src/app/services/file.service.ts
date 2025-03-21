import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'tsyringe';
import { ENV_CONFIG } from '../config';




/**
 * FileService - Dịch vụ quản lý upload file lên Azure Storage
 */
@injectable()
class FileService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ReturnType<BlobServiceClient["getContainerClient"]>;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(ENV_CONFIG.file.connectionString!);
    this.containerClient = this.blobServiceClient.getContainerClient(ENV_CONFIG.file.containerName!);
  }

  /**
   * Upload file lên Azure Blob Storage
   * @param fileBuffer - Dữ liệu file dưới dạng Buffer
   * @param mimeType - Kiểu nội dung file (MIME type)
   * @returns URL file đã tải lên
   */
  async uploadFileToAzure(fileBuffer, mimeType, fileName): Promise<string> {
    try {
      const blobName = `avatars/${fileName}`;
      const blockBlobClient =this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: mimeType },
      });

      return blockBlobClient.url;
    } catch (error) {
      console.error("Azure Upload Error:", error);
      throw new Error("Failed to upload file to Azure");
    }
  }
}

export default FileService;
