// Kicks off the auth check as early as possible.
// init.js awaits window.authReady before rendering the app.
import { requireAuth } from './auth.js';

window.authReady = requireAuth();
