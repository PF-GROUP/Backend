"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationService = void 0;
const common_1 = require("@nestjs/common");
let CustomizationService = class CustomizationService {
    create(createCustomizationDto) {
        return 'This action adds a new customization';
    }
    findAll() {
        return `This action returns all customization`;
    }
    findOne(id) {
        return `This action returns a #${id} customization`;
    }
    update(id, updateCustomizationDto) {
        return `This action updates a #${id} customization`;
    }
    remove(id) {
        return `This action removes a #${id} customization`;
    }
};
exports.CustomizationService = CustomizationService;
exports.CustomizationService = CustomizationService = __decorate([
    (0, common_1.Injectable)()
], CustomizationService);
//# sourceMappingURL=customization.service.js.map