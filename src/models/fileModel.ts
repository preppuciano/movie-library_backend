import mongoose, { Model, Schema } from "mongoose";
import { MIMETypeEnum } from "./movieModel";


export interface FileCoudModel extends DocumentEventMap {
  mimeType: string | undefined;
  size: number;
  path: string;
  cloudPath?: string;
  url: string;
}

const FileCloudSchema = new Schema<FileCoudModel>({
  path: {
    type: String,
    required: true,
  },
  cloudPath: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
},
  {
    collection: 'files',
  }
);

const FileCloud: Model<FileCoudModel> = mongoose.model<FileCoudModel>('File', FileCloudSchema);
export default FileCloud;