import mongoose, { Model, Schema } from "mongoose";

const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3000');
const SERVER_URI = `${SERVER_HOST}:${SERVER_PORT}`;

export enum MIMETypeEnum {
  MKV = 'video/x-matroska',
  AVI = 'video/x-msvideo',
  MP4 = 'video/mp4',
}

export enum LanguagesEnum {
  English = 'en',
  Spanish = 'es',
  German = 'de',
  French = 'fr',
  Swedish = 'sv',
  Zhongwen = 'zh',
  Japanese = 'ja',
  Korean = 'ko',
  Italian = 'it',
  Polish = 'pl',
  Danish = 'da',
  Dutch = 'nl',
  Turkish = 'tr',
  Chinese = 'cn'
}

export interface MovieModel extends Document {
  id: string;
  name: string;
  year: number;
  imagenName: string;
  isWatched: boolean;
  fileData: FileDataModel;
  movieData: MovieDataModel;
}

export interface FileDataModel {
  mimeType: MIMETypeEnum;
  name: string;
  size: number;
  duration: number;
  audios: LanguagesEnum[];
  subtitles: LanguagesEnum[];
  resolution: {
    width: number;
    height: number;
  };
}

export interface MovieDataModel {
  id: string;
  backdropPath: string;
  originalLanguage: LanguagesEnum;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  title: string;
  voteAverage: number;
  runtime: number;
  imdbId: string;
  videos: string[];
  genres: {
    id: number;
    name: string;
  }[];
}

const MovieDataSchema = new Schema<MovieDataModel>({
  id: {
    type: String,
    required: true,
  },
  backdropPath: {
    type: String,
    required: true,
  },
  originalLanguage: {
    type: String,
    enum: Object.values(LanguagesEnum),
    required: true,
  },
  originalTitle: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    default: "",
    required: false,
  },
  posterPath: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  voteAverage: {
    type: Number,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
  },
  imdbId: {
    type: String,
    required: true,
  },
  videos: {
    type: [String],
    required: true,
  },
  genres: {
    type: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true }
      }
    ],
    required: true,
  }
});

const FileDataSchema = new Schema<FileDataModel>({
  name: {
    type: String, required: true
  },
  size: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    enum: Object.values(MIMETypeEnum),
    required: true,
  },
  audios: {
    type: [String],
    enum: Object.values(LanguagesEnum),
    required: true,
  },
  subtitles: {
    type: [String],
    enum: Object.values(LanguagesEnum),
    required: true,
  },
  resolution: {
    type: {
      width: Number,
      height: Number,
    },
    required: true,
  },
});

const MovieSchema = new Schema<MovieModel>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  imagenName: {
    type: String,
    required: true,
    get: function (value: string): string {
      return value;
    }
  },
  isWatched: {
    type: Boolean,
    required: true,
  },
  fileData: {
    type: FileDataSchema,
    required: true,
  },
  movieData: {
    type: MovieDataSchema,
    required: true,
  },
},
  {
    collection: 'movies',
  }
);

MovieSchema.virtual('imagenUrl').get(function () {
  return `${this.imagenName}`;
  // return `http://${SERVER_URI}/public/images/movies/${this.imagenName}`;
});

// Habilita los getters al convertir el documento a JSON u objeto
MovieSchema.set('toJSON', { getters: true, virtuals: true });
MovieSchema.set('toObject', { getters: true, virtuals: true });

const Movie: Model<MovieModel> = mongoose.model<MovieModel>('Movie', MovieSchema);
export default Movie;