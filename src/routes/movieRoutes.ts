import express from "express";
import { getMovieById, getMovies, fetchSaveMovie } from "../controllers/movieControllers";

const router = express.Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.post('/movies/fetch-save', fetchSaveMovie);

export default router;