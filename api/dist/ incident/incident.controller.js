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
exports.IncidentController = void 0;
const common_1 = require("@nestjs/common");
const incident_service_1 = require("./incident.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const ld = require("lodash");
let IncidentController = class IncidentController {
    constructor(incidentService, jwtService) {
        this.incidentService = incidentService;
        this.jwtService = jwtService;
    }
    getIncidents(accessToken) {
        if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {
            return this.incidentService.getIncidents();
        }
        else {
            return { status: 401 };
        }
    }
    getIncidentsByType(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {
                const issues = (yield this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;
                return {
                    critical: issues.filter(e => e.fields.priority.name === 'High').length,
                    normal: issues.filter(e => e.fields.priority.name === 'Low').length,
                    warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
                };
            }
            else {
                return { status: 401 };
            }
        });
    }
    getIncidentsTotal(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {
                const issues = (yield this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;
                const date = new Date();
                date.setDate(date.getDate() - 2);
                return {
                    perDay: issues.filter(e => new Date(e.fields.created) >= date).length,
                    inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,
                    done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
                };
            }
            else {
                return { status: 401 };
            }
        });
    }
    getTraffic(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {
                const ch = new this.incidentService.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });
                const answer = yield ch.querying('SELECT * FROM Etanol_PROD.DataFlow_v2 LIMIT 5000 FORMAT JSONEachRow');
                const data = answer.split('\n').filter(e => e.length > 0).map(e => JSON.parse(e));
                const date = new Date();
                date.setDate(date.getDate() - 30);
                const result = data
                    .filter(e => new Date(e.time_db_sec) > date)
                    .map(e => new Date(e.time_db_sec));
                return ld.groupBy(result);
            }
            else {
                return { status: 401 };
            }
        });
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], IncidentController.prototype, "getIncidents", null);
__decorate([
    common_1.Get('bytype'),
    __param(0, common_1.Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "getIncidentsByType", null);
__decorate([
    common_1.Get('total'),
    __param(0, common_1.Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "getIncidentsTotal", null);
__decorate([
    common_1.Get('traffic'),
    __param(0, common_1.Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "getTraffic", null);
IncidentController = __decorate([
    common_1.Controller('api/incident'),
    __metadata("design:paramtypes", [incident_service_1.IncidentService,
        jwt_1.JwtService])
], IncidentController);
exports.IncidentController = IncidentController;
//# sourceMappingURL=incident.controller.js.map