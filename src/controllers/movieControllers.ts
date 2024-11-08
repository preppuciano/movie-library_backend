import { Request, Response } from "express";
import Movie, { FileDataModel, MIMETypeEnum, MovieDataModel } from "../models/movieModel";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { uploadPhoto } from "../services/cloudinaryService";

export async function getMoviesV1(_req: Request, res: Response) {
  try {
    const data = await Movie.find();
    res.status(200).send({ success: true, message: 'Data fetched successfully', data });
  } catch (err) {
    res.status(500).send({ success: false, message: 'An error occurred while fetching the data', error: err });
  }
}

export async function getMovies(req: Request, res: Response) {
  const { page = 1, limit = 30, year, genre, letter } = req.query;

  try {
    const filter: any = {};

    if (year) {
      if (year == '90') {
        filter['year'] = { $gte: 1900, $lte: 1999 };
      } else {
        filter['year'] = year;
      }
    };
    if (genre) filter['movieData.genres.id'] = { $in: [Number(genre)] };
    if (letter) {
      if (letter == "0-9") {
        const regex = new RegExp(`^[0-9]`, 'i');
        filter['movieData.title'] = regex;
      } else {
        const regex = new RegExp(`^${letter}`, 'i');
        filter['movieData.title'] = regex;
      }
    }

    const data = await Movie.find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));

    // const totalMovies = await Movie.countDocuments();
    const totalMovies = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(totalMovies / Number(limit));
    const pagination = {
      page: Number(page),
      limit: Number(limit),
      totalPages: totalPages,
      totalMovies: totalMovies,
    }
    res.status(200).send({ success: true, message: 'Data fetched successfully', data, pagination });
  } catch (err) {
    res.status(500).send({ success: false, message: 'An error occurred while fetching the data', error: err });
  }
}

export async function getMovieById(req: Request, res: Response) {
  const idParams = req.params.id;
  try {
    const data = await Movie.findOne({ id: idParams });
    if (data) {
      res.status(200).send({ success: true, message: 'Data fetched successfully', data });
    } else {
      res.status(404).send({ success: false, message: 'Data not found', data: null });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: 'An error occurred while fetching the data', error: err });
  }
}

export async function fetchSaveMovie(req: Request<{}, {}, { imdbId: string }>, res: Response) {
  const TMDBprefixImage = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';
  const urlUS = `https://api.themoviedb.org/3/movie/${req.body.imdbId}?language=en-US`;
  const urlES = `https://api.themoviedb.org/3/movie/${req.body.imdbId}?language=es-CL`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_KEY}`
    }
  };

  const responseUS = await fetch(urlUS, options).then((res) => res.json());
  const responseES = await fetch(urlES, options).then((res) => res.json());

  const newMovieData: MovieDataModel = {
    originalTitle: responseUS['original_title'],
    originalLanguage: responseUS['original_language'],
    imdbId: responseUS['imdb_id'],
    id: responseUS['id'],
    overview: responseUS['overview'],
    voteAverage: responseUS['vote_average'],
    releaseDate: responseUS['release_date'],
    runtime: responseUS['runtime'],
    backdropPath: responseUS['backdrop_path'],
    title: responseES['title'],
    genres: responseES['genres'],
    videos: [],
    posterPath: `${TMDBprefixImage}${responseUS['poster_path']}`,
  }

  const fileName = `${newMovieData.id}${path.extname(newMovieData.posterPath)}`;


  let filePath: string;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  if (NODE_ENV == 'production') {
    filePath = path.join(__dirname, '../public/tmp', fileName);
  } else {
    filePath = path.join(__dirname, '../../public/tmp', fileName);
  }

  try {
    const response = await axios({
      url: newMovieData.posterPath,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
      const photo = await uploadPhoto({ filePath: filePath, folderName: 'movies_new' });

      const newFileData: FileDataModel = {
        audios: [],
        name: 'unknown',
        mimeType: MIMETypeEnum.MKV,
        subtitles: [],
        size: 0,
        resolution: { width: 1920, height: 1080 },
        duration: 0,
      }

      const newMovie = new Movie(
        {
          id: newMovieData.id,
          name: newMovieData.title,
          year: newMovieData.releaseDate.split('-')[0],
          imagenName: photo.url,
          isWatched: false,
          fileData: newFileData,
          movieData: newMovieData,
        }
      )

      try {
        const savedMovie = await newMovie.save();
        res.status(200).send({ success: true, message: 'Data fetched successfully', data: savedMovie });
      } catch (err) {
        res.status(500).send({ success: false, message: 'An error occurred while getting the images', error: err });
      }
    });

    writer.on('error', (error) => {
      throw error;
    });

  } catch (err) {
    res.status(500).send({ success: false, message: 'An error occurred while getting the images', error: err });
  }
}