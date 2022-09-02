import { derived } from "svelte/store";
import { RecordApi } from "../api";
import { app } from "./obsidian";

export const api = derived(app, ($app) => new RecordApi($app));
