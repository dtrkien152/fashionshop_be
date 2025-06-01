import { inject, injectable } from 'tsyringe';
import { FileService, PostService } from '../services';
import { NextFunction, Request, Response } from 'express';

@injectable()
class FileController {
  constructor(@inject(FileService) private fileService: FileService) {
  }

  uploadMultiple = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const files = req.files as Express.Multer.File[];
      // Upload tất cả ảnh song song
      const uploadPromises = files.map((file) =>
        this.fileService.uploadFileToAzure(file.buffer, file.mimetype, `${Date.now()}-${file.originalname}`),
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      res.json(uploadedUrls);
    } catch (error) {
      next(error);
    }
  };

}

export default FileController;
