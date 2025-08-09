import assert from 'node:assert/strict';
import { buildDeck } from '../src/tarot-core.js';

// The tarot deck should contain 78 cards: 22 majors and 56 minors
assert.equal(buildDeck().length, 78);
