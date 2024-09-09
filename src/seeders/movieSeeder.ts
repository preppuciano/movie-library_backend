import { connectMongoose } from "../config/database";
import Movie, { MovieModel } from "../models/movieModel";
import data from './data_json_es_v2.json';

async function main(): Promise<void> {
  try {
    await connectMongoose();
    const movies: MovieModel[] = data as MovieModel[];
    const res = await Movie.collection.insertMany(movies);
    console.log(res);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
