import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { injectable } from "tsyringe";

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME) {
  throw new Error("Azure storage configuration is missing!");
}

/**
 * FileService - Dịch vụ quản lý upload file lên Azure Storage
 */
@injectable()
class FileService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ReturnType<BlobServiceClient["getContainerClient"]>;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING!);
    this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME!);
  }

  /**
   * Upload file lên Azure Blob Storage
   * @param fileBuffer - Dữ liệu file dưới dạng Buffer
   * @param mimeType - Kiểu nội dung file (MIME type)
   * @returns URL file đã tải lên
   */
  async uploadFileToAzure(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      const fileName = `avatar-${uuidv4()}.jpg`; // Tạo tên file duy nhất
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: mimeType },
      });

      return blockBlobClient.url; // Trả về URL file đã tải lên
    } catch (error) {
      console.error("Azure Upload Error:", error);
      throw new Error("Failed to upload file to Azure");
    }
  }
}

export default FileService;
