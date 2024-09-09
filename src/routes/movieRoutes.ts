import express from "express";
import { getMovieById, getMovies } from "../controllers/movieControllers";

const router = express.Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);

export default router;