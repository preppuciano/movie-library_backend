import { Request, Response } from "express";
import Movie from "../models/movieModel";

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