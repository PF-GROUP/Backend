"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationController = void 0;
const common_1 = require("@nestjs/common");
const customization_service_1 = require("./customization.service");
const create_customization_dto_1 = require("./Customization/create-customization.dto");
const update_customization_dto_1 = require("./Customization/update-customization.dto");
let CustomizationController = class CustomizationController {
    customizationService;
    constructor(customizationService) {
        this.customizationService = customizationService;
    }
    create(createCustomizationDto) {
        return this.customizationService.create(createCustomizationDto);
    }
    findAll() {
        return this.customizationService.findAll();
    }
    findOne(id) {
        return this.customizationService.findOne(+id);
    }
    update(id, updateCustomizationDto) {
        return this.customizationService.update(+id, updateCustomizationDto);
    }
    remove(id) {
        return this.customizationService.remove(+id);
    }
};
exports.CustomizationController = CustomizationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_customization_dto_1.CreateCustomizationDto !== "undefined" && create_customization_dto_1.CreateCustomizationDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], CustomizationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomizationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomizationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_customization_dto_1.UpdateCustomizationDto !== "undefined" && update_customization_dto_1.UpdateCustomizationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CustomizationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomizationController.prototype, "remove", null);
exports.CustomizationController = CustomizationController = __decorate([
    (0, common_1.Controller)('customization'),
    __metadata("design:paramtypes", [customization_service_1.CustomizationService])
], CustomizationController);
//# sourceMappingURL=customization.controller.js.map