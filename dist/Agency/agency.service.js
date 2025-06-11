"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyService = void 0;
const common_1 = require("@nestjs/common");
let AgencyService = class AgencyService {
    create(createAgencyDto) {
        return 'This action adds a new agency';
    }
    findAll() {
        return `This action returns all agency`;
    }
    findOne(id) {
        return `This action returns a #${id} agency`;
    }
    update(id, updateAgencyDto) {
        return `This action updates a #${id} agency`;
    }
    remove(id) {
        return `This action removes a #${id} agency`;
    }
};
exports.AgencyService = AgencyService;
exports.AgencyService = AgencyService = __decorate([
    (0, common_1.Injectable)()
], AgencyService);
//# sourceMappingURL=agency.service.js.map