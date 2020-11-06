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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const user_entity_1 = require("../user.entity");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(user);
        });
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.register(user);
        });
    }
    validateToken(accessToken) {
        console.log(accessToken);
        return auth_service_1.validateAccessToken(accessToken, this.jwtService);
    }
    test(accessToken) {
        if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {
            return accessToken;
        }
        else {
            return { status: 401 };
        }
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    common_1.Get('validate/:access_token'),
    __param(0, common_1.Param('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Boolean)
], AuthController.prototype, "validateToken", null);
__decorate([
    common_1.Post('validatetest'),
    __param(0, common_1.Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "test", null);
AuthController = __decorate([
    common_1.Controller('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map