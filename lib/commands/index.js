"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Command Map.
 *
 * Each key corresponds to a function representing that command.
 *
 * Command functions take an object containing all bot actions, pulling
 * only those which they need, and call those bot actions to
 * make the bot do things.
 *
 * Notice that the commands do not gain access to the original message object.
 */
const COMMANDS = {
    ping: ({ say }) => say('Pong!'),
    pong: ({ say }) => say('Ping!'),
};
exports.default = COMMANDS;
