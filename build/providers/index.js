"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
class SeznamDriverProvider {
    constructor(app) {
        this.app = app;
    }
    async boot() {
        const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally');
        const { SeznamDriver } = await Promise.resolve().then(() => __importStar(require('../src/SeznamDriver')));
        Ally.extend('yourdriver', (_, __, config, ctx) => {
            return new SeznamDriver(ctx, config);
        });
    }
}
exports.default = SeznamDriverProvider;
