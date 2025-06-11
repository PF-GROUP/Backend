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
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("./images.service");
const create_image_dto_1 = require("./Images/create-image.dto");
const update_image_dto_1 = require("./dto/update-image.dto");
let ImagesController = class ImagesController {
    imagesService;
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    create(createImageDto) {
        return this.imagesService.create(createImageDto);
    }
    findAll() {
        return this.imagesService.findAll();
    }
    findOne(id) {
        return this.imagesService.findOne(+id);
    }
    update(id, updateImageDto) {
        return this.imagesService.update(+id, updateImageDto);
    }
    remove(id) {
        return this.imagesService.remove(+id);
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_image_dto_1.CreateImageDto !== "undefined" && create_image_dto_1.CreateImageDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_image_dto_1.UpdateImageDto !== "undefined" && update_image_dto_1.UpdateImageDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "remove", null);
exports.ImagesController = ImagesController = __decorate([
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map