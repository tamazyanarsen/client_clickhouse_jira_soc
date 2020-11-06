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
exports.AuthService = exports.validateAccessToken = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("./user.service");
const crypto = require("crypto");
function validateAccessToken(accessToken, jwtService) {
    try {
        jwtService.verify(accessToken);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.validateAccessToken = validateAccessToken;
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    validateUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.findByEmail(userData.email);
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.validateUser(user).then((userData) => {
                user.password = crypto.createHmac('sha256', user.password).digest('hex');
                if (!userData || user.password !== userData.password) {
                    return { status: 401 };
                }
                const payload = `${userData.name}${userData.id}`;
                const accessToken = this.jwtService.sign(payload);
                return {
                    expires_in: 3600,
                    access_token: accessToken,
                    user_id: payload,
                    status: 200,
                };
            });
        });
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.create(user);
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map