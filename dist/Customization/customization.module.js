"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationModule = void 0;
const common_1 = require("@nestjs/common");
const customization_service_1 = require("../customization.service");
const customization_controller_1 = require("./customization.controller");
let CustomizationModule = class CustomizationModule {
};
exports.CustomizationModule = CustomizationModule;
exports.CustomizationModule = CustomizationModule = __decorate([
    (0, common_1.Module)({
        controllers: [customization_controller_1.CustomizationController],
        providers: [customization_service_1.CustomizationService],
    })
], CustomizationModule);
//# sourceMappingURL=customization.module.js.map