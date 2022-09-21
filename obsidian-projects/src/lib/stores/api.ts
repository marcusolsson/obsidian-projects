import { derived } from "svelte/store";
import { DataApi } from "../api";
import { app } from "./obsidian";

export const api = derived(app, ($app) => new DataApi($app));
