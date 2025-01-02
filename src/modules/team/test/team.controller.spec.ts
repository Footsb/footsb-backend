import { Test } from '@nestjs/testing';

import { TeamController } from '../team.controller';
import { TeamService } from '../team.service';
import { TeamListDto } from '../dto/find-all.dto';
import { TeamDetailDto } from '../dto/find-one.dto';

describe('🚀 TeamController', () => {
  let teamController: TeamController;
  let teamService: TeamService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    teamController = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  describe('📌 [GET] findAll', () => {
    test('풋스비에 등록된 팀 목록을 조회할 수 있다!', async () => {
      const mockedTeams: TeamListDto[] = [
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

      jest.spyOn(teamService, 'findAll').mockResolvedValue(mockedTeams);
      const result = await teamController.findAll();

      expect(result).toEqual(mockedTeams);
    });

    test('풋스비에 등록된 팀이 없을 경우 빈 배열을 반환한다!', async () => {
      const mockedTeams: TeamListDto[] = [];

      jest.spyOn(teamService, 'findAll').mockResolvedValue(mockedTeams);
      const result = await teamController.findAll();

      expect(result).toEqual(mockedTeams);
    });
  });

  describe('📌 [GET] findOne', () => {
    test('풋스비에 등록된 팀 정보를 조회할 수 있다', async () => {
      const mockedTeam: TeamDetailDto = {
        id: 1,
        ownerName: "김상웅",
        name: "풋스비 메인",
        summary: "풋스비 메인 화면입니다.",
        description: null,
        thumbnailImage: null,
        proCareerMembers: 0,
        manner: 100,
        exerciseDays: "월, 수",
        exerciseTime: "18~24",
        exerciseAddress: "제주 서귀포시",
        memberCounts: 10,
        maxMembers: 30,
        formation: "4-4-2",
        isRecruitingMembers: false,
        teamType: "FOOTBALL",
        genderType: "ANY",
        levelType: "하하하",
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        deletedAt: null
      };

      jest.spyOn(teamService, 'findOne').mockResolvedValue(mockedTeam);
      const result = await teamController.findOne(1);

      expect(result).toEqual(mockedTeam);
    });
  });
});
