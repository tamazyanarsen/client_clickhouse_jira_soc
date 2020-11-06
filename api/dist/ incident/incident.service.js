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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const common_1 = require("@nestjs/common");
const state_1 = require("./state");
const lod = require("lodash");
const JiraApi = require('jira-client');
let IncidentService = class IncidentService {
    constructor() {
        this.incidentsArr = state_1.IncidentsState.getInstance().incidents;
        this.jira = new JiraApi({
            protocol: 'https',
            host: 'sd.soc.secure-soft.tech',
            username: 'web-app-user',
            password: 'ZLn8g$uLpZurnZ',
            apiVersion: '2',
            strictSSL: true,
        });
        this.ClickHouse = require('@apla/clickhouse');
    }
    getIncidents() {
        return this.incidentsArr;
    }
    getCountIncidentByType(type) {
        return lod.filter(this.incidentsArr, (incident) => {
            return incident.type === type;
        }).length;
    }
    getIncidentsByType() {
        return {
            critical: this.getCountIncidentByType('critical'),
            normal: this.getCountIncidentByType('normal'),
            warning: this.getCountIncidentByType('warning'),
        };
    }
    getCountIncidentPerDay() {
        const dayMillis = 24 * 3600 * 1000;
        return lod.filter(this.incidentsArr, (incident) => {
            return new Date().getTime() - incident.timeStamp.getTime() <= dayMillis;
        }).length;
    }
    getCountIncidentByStatus(status) {
        return lod.filter(this.incidentsArr, (incident) => {
            return incident.status === status;
        }).length;
    }
    getIncidentsTotalInfo() {
        return {
            total: this.incidentsArr.length,
            perday: this.getCountIncidentPerDay(),
            unresolved: this.getCountIncidentByStatus('unresolved'),
            resolved: this.getCountIncidentByStatus('resolved'),
        };
    }
};
IncidentService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], IncidentService);
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident.service.js.map