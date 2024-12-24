import { Repository } from "typeorm";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { TeamService } from "../team.service";
import { Team } from "../entity/team.entity";
import { GenderTypeEnum } from "src/common/eunm/gender-type.enum";
import { TeamTypeEnum } from "src/common/eunm/team-type.enum";
import { TeamListDto } from "../dto/find-all.dto";

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('🚀 TeamService', () => {
  let teamService: TeamService;
  let teamRepository: MockRepository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: {
            query: jest.fn()
          }
        }
      ]
    }).compile();
    
    teamService = module.get<TeamService>(TeamService);
    teamRepository = module.get<MockRepository<Team>>(getRepositoryToken(Team));
  });

  describe('📌 findAll', () => {
    test('등록된 팀이 있는 경우 조회 쿼리를 통해 TeamListDto 데이터를 반환할 수 있다!', async () => {
      const mockedData = [
        {
          id: 1,
          name: 'test-team1',
          exerciseDays: 'test-exercise-days1',
          exerciseTime: 'test-exercise-time1',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: TeamTypeEnum.FOOTBALL,
          genderType: GenderTypeEnum.MALE,
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 2,
          name: 'test-team2',
          exerciseDays: 'test-exercise-days2',
          exerciseTime: 'test-exercise-time2',
          memberCounts: 22,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: TeamTypeEnum.FOOTBALL,
          genderType: GenderTypeEnum.MALE,
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 3,
          name: 'test-team3',
          exerciseDays: 'test-exercise-days3',
          exerciseTime: 'test-exercise-time3',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: TeamTypeEnum.FOOTBALL,
          genderType: GenderTypeEnum.MALE,
          createdAt: new Date('2025-01-01'),
        },
      ];
      jest.spyOn(teamRepository, 'query').mockResolvedValue(mockedData);
      const result = await teamService.findAll();

      const mockedResponse: TeamListDto[] = [
        {
          id: 1,
          name: 'test-team1',
          exerciseDays: 'test-exercise-days1',
          exerciseTime: 'test-exercise-time1',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 2,
          name: 'test-team2',
          exerciseDays: 'test-exercise-days2',
          exerciseTime: 'test-exercise-time2',
          memberCounts: 22,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 3,
          name: 'test-team3',
          exerciseDays: 'test-exercise-days3',
          exerciseTime: 'test-exercise-time3',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
      ];
      expect(result).toEqual(mockedResponse);
    });

    test('등록된 팀이 없을 경우 빈 배열을 반환할 수 있다!', async () => {
      const mockedData = [];

      jest.spyOn(teamRepository, 'query').mockResolvedValue(mockedData);
      const result = await teamService.findAll();

      expect(result).toEqual([]);
    });
  });
});